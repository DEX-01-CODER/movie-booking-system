from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Movie, Booking

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ["id", "title", "description", "release_date", "price_per_ticket"]

class BookingSerializer(serializers.ModelSerializer):
    movie_title = serializers.ReadOnlyField(source='movie.title') # Helper for Order History

    class Meta:
        model = Booking
        fields = [
            "id", "user", "movie", "movie_title", "theater_name", 
            "show_time", "quantity", "total_price", "status", "booked_at"
        ]
        extra_kwargs = {
            "user": {"read_only": True},
            "status": {"read_only": True},
            "total_price": {"read_only": True} # We will calculate this on the backend
        }