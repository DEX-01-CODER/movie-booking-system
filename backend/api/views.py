from django.contrib.auth.models import User
from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction

from .permissions import IsAdmin, IsAdminOrReadOnly, IsOrderOwner
from .serializers import (
    UserSerializer, MovieSerializer, ShowSerializer,
    TheaterSerializer, TicketSerializer, ReviewSerializer,
    SeatSerializer, ShowSeatSerializer
)
from .models import (
    Movie, Show, Theater, Ticket, Review,
    Seat, ShowSeat, TicketSeat, Payment
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
    permission_classes = [IsAdmin]


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.select_related("movie", "theater").prefetch_related("show_seats__seat").all()
    serializer_class = ShowSerializer
    permission_classes = [IsAdminOrReadOnly]



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
        # Expected seat_ids in request data: list of seat IDs to book.
        show = serializer.validated_data.get("show")
        seat_ids = self.request.data.get("seat_ids", [])

        if not show or not seat_ids:
            raise ValidationError("Show and seat_ids are required for ticket booking.")

        # Fetch ShowSeats
        show_seats = ShowSeat.objects.select_for_update().filter(show=show, seat_id__in=seat_ids, is_booked=False)

        if show_seats.count() != len(seat_ids):
            raise ValidationError("Some selected seats are already booked. Please choose other seats.")

        total_price = show.price * len(seat_ids)

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
        return super().get_permissions()



class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related("movie", "user").all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
