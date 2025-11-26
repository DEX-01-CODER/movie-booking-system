from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, MovieSerializer, BookingSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly, IsAdminUser
from .models import Movie, Booking

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class MovieListCreate(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    
    def get_permissions(self):
        # anyone can get movies list
        if self.request.method == "GET":
            return [IsAuthenticatedOrReadOnly()]
        # only admins allowed to create new movies
        return [IsAdminUser()]
    
class BookingListCreate(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter bookings so users only see their own history
        return Booking.objects.filter(user=self.request.user).order_by('-booked_at')

    def perform_create(self, serializer):
        # Get the movie and quantity from the request data
        movie = serializer.validated_data.get('movie')
        quantity = serializer.validated_data.get('quantity')

        # Calculate the total price automatically
        # Default to 0 if something is missing, though serializer validation handles most of this
        price = movie.price_per_ticket if movie else 0
        total = price * quantity

        # Save the booking with the user and the calculated total price
        serializer.save(user=self.request.user, total_price=total)


class BookingDelete(generics.DestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)