from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
    IsAdminUser,
)
from .serializers import UserSerializer, MovieSerializer, BookingSerializer
from .models import Movie, Booking
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class MovieListCreate(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def get_permissions(self):
        # Anyone can view movies
        if self.request.method == "GET":
            return [IsAuthenticatedOrReadOnly()]
        # Only admins can add new movies
        return [IsAdminUser()]


class BookingListCreate(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Booking.objects
            .filter(user=self.request.user)
            .select_related("movie")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookingDelete(generics.DestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Limit to current user for safety
        return Booking.objects.filter(user=self.request.user)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


