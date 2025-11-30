# backend/api/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Movie, Booking


class UserSerializer(serializers.ModelSerializer):
    
    full_name = serializers.CharField(source="first_name", required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "password"]
        extra_kwargs = {
            "password": {
                "write_only": True,     # can send it on register, never returned
                "min_length": 6,
            },
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ["id", "title", "description", "release_date"]



class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "user", "movie", "seats", "booked_at"]
        read_only_fields = ["id", "user", "booked_at"]
