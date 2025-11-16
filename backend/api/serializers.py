from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Movie, Booking

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only" : True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ["id", "title", "description", "release_date"]
        extra_kwargs = {"title": {"read_only":True}}


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "user", "movie", "seats", "booked_at"]
        extra_kwargs = {
            "booked_at": {"read_only": True}
        }