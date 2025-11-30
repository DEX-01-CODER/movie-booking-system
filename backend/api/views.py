from django.contrib.auth.models import User
from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from .permissions import IsAdmin, IsAdminOrReadOnly, IsOrderOwner
from .serializers import (
    UserSerializer, MovieSerializer, ShowSerializer,
    TheaterSerializer, TicketSerializer, ReviewSerializer,
    SeatSerializer, ShowSeatSerializer
)
from .models import (
    Movie, Show, Theater, Ticket, Review,
    Seat, ShowSeat, TicketSeat, Payment, CANCELLATION_POLICY
)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)



class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdminOrReadOnly]


class TheaterViewSet(viewsets.ModelViewSet):
    queryset = Theater.objects.prefetch_related("seats").all()
    serializer_class = TheaterSerializer
    permission_classes = [IsAdminOrReadOnly]


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.select_related("movie", "theater").prefetch_related("show_seats__seat").all()
    serializer_class = ShowSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Show.objects.select_related("movie", "theater").prefetch_related("show_seats__seat").all()
        
        # Filter by movie if provided
        movie_id = self.request.query_params.get('movie', None)
        if movie_id:
            queryset = queryset.filter(movie__id=movie_id)
        
        # Filter by theater if provided
        theater_id = self.request.query_params.get('theater', None)
        if theater_id:
            queryset = queryset.filter(theater__id=theater_id)
        
        return queryset



class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.select_related("user", "show").prefetch_related("ticket_seats__seat").all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(user=user)

    @transaction.atomic
    def perform_create(self, serializer):
        # Expected seat_ids in request data: list of ShowSeat IDs to book.
        show = serializer.validated_data.get("show")
        showseat_ids = self.request.data.get("seat_ids", [])

        if not show or not showseat_ids:
            raise ValidationError("Show and seat_ids are required for ticket booking.")

        # Fetch ShowSeats by their IDs (not Seat IDs)
        show_seats = ShowSeat.objects.select_for_update().filter(
            id__in=showseat_ids, 
            show=show, 
            is_booked=False
        )

        if show_seats.count() != len(showseat_ids):
            raise ValidationError("Some selected seats are already booked or invalid. Please choose other seats.")

        total_price = show.price * len(showseat_ids)

        # Create ticket
        ticket = serializer.save(user=self.request.user, total_price=total_price)

        # Mark seats as booked and create TicketSeat objects
        TicketSeat.objects.bulk_create([
            TicketSeat(ticket=ticket, seat=ss.seat) for ss in show_seats
        ])
        show_seats.update(is_booked=True)

    def get_permissions(self):
        if self.action in ["destroy", "update", "partial_update"]:
            return [IsOrderOwner()]
        if self.action == "cancel_ticket":
            return [IsOrderOwner()]
        return super().get_permissions()

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel_ticket(self, request, pk=None):
        """Cancel a ticket and process refund based on cancellation policy"""
        ticket = self.get_object()

        # Check if ticket is already cancelled
        if ticket.status == 'cancelled':
            return Response(
                {"error": "Ticket is already cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if ticket is used
        if ticket.status == 'used':
            return Response(
                {"error": "Cannot cancel a used ticket"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if show has not passed
        now = timezone.now()
        show_time = ticket.show.showtime
        
        if show_time <= now:
            return Response(
                {"error": "Cannot cancel ticket for a past show"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate hours until show
        time_until_show = show_time - now
        hours_until_show = time_until_show.total_seconds() / 3600

        # Check minimum cancellation time, we set our rules in the CANCELLATION_POLICY
        if hours_until_show < CANCELLATION_POLICY['min_hours_before_show']:
            return Response(
                {"error": f"Cannot cancel within {CANCELLATION_POLICY['min_hours_before_show']} hour of show start"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate refund based on policy
        if hours_until_show >= 24:
            refund_percentage = CANCELLATION_POLICY['hours_24_plus']
        elif hours_until_show >= 6:
            refund_percentage = CANCELLATION_POLICY['hours_6_24']
        else:
            refund_percentage = CANCELLATION_POLICY['hours_1_6']

        refund_amount = (ticket.total_price * refund_percentage) / 100

        # Update ticket
        with transaction.atomic():
            ticket.status = 'cancelled'
            ticket.cancelled_at = now
            ticket.refund_amount = refund_amount
            ticket.cancellation_reason = request.data.get('reason', 'User requested cancellation')
            ticket.save()

            # Release booked seats
            show_seats = ShowSeat.objects.filter(
                show=ticket.show,
                seat__in=ticket.ticket_seats.all().values_list('seat_id', flat=True)
            )
            show_seats.update(is_booked=False)

        serializer = self.get_serializer(ticket)
        return Response({
            "message": "Ticket cancelled successfully",
            "refund_amount": str(refund_amount),
            "refund_percentage": refund_percentage,
            "ticket": serializer.data
        }, status=status.HTTP_200_OK)



class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Review.objects.select_related("movie", "user").all()
        movie_id = self.request.query_params.get("movie")
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
