from django.contrib.auth.models import User
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError

from .permissions import IsAdmin, IsAdminOrReadOnly, IsOrderOwner
from .serializers import (
    UserSerializer, MovieSerializer, ShowSerializer,
    TheaterSerializer, TicketSerializer, ReviewSerializer
)

from .models import Movie, Show, Theater, Ticket, Review


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdminOrReadOnly]

class TheaterViewSet(viewsets.ModelViewSet):
    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer
    permission_classes = [IsAdmin]


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.select_related("movie", "theater").all()
    serializer_class = ShowSerializer
    permission_classes = [IsAdminOrReadOnly]


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.select_related("user", "show").all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(user=user)

    def perform_create(self, serializer):
        show = serializer.validated_data.get("show")
        quantity = serializer.validated_data.get("quantity")

        if not show:
            raise ValidationError("Show is required for ticket booking.")

        # price comes from SHOW, not Movie
        price = show.price
        total = price * quantity

        serializer.save(
            user=self.request.user,
            total_price=total
        )

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
