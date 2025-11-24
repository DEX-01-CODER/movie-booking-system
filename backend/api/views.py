from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, generics
from .serializers import UserSerializer, MovieSerializer, ShowSerializer, TheaterSerializer, TicketSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly, IsAdminUser
from .models import Movie, Show, Theater, Ticket, Review
from .permissions import IsAdmin, IsAdminOrReadOnly, IsOrderOwner

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdminOrReadOnly]


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.select_related("movie", "theater").all()
    serializer_class = ShowSerializer
    permission_classes = [IsAdminOrReadOnly]


class TheaterViewSet(viewsets.ModelViewSet):
    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer
    permission_classes = [IsAdmin]


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.select_related("user", "show").all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    # for users, sending their tickets and for admin, sending all
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # for changes, we will check use our custom permission 
    def get_permissions(self):
        if self.action in ["destroy", "update", "partial_update"]:
            return [IsOrderOwner]
        return super().get_permissions()
    

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.object.select_related("movie", "user").all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)