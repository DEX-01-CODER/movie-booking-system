from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Movie, Show, Theater, Ticket, Review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class MovieSerializer(serializers.ModelSerializer):
    description = serializers.CharField(source="synopsis")  # mapping for old frontend

    class Meta:
        model = Movie
        fields = [
            "id", "title", "description", "cast", "genre",
            "runtime_minutes", "release_date", "rating",
            "poster_url", "trailer_url", "is_current",
            "created_at", "updated_at"
        ]


class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = "__all__"


class ShowSerializer(serializers.ModelSerializer):
    movie_title = serializers.ReadOnlyField(source="movie.title")
    theater_name = serializers.ReadOnlyField(source="theater.name")

    class Meta:
        model = Show
        fields = "__all__"


class TicketSerializer(serializers.ModelSerializer):
    movie = serializers.PrimaryKeyRelatedField(read_only=True, source="show.movie")
    movie_title = serializers.CharField(source="show.movie.title", read_only=True)
    theater_name = serializers.CharField(source="show.theater.name", read_only=True)
    show_time = serializers.DateTimeField(source="show.showtime", read_only=True)

    # read-only so frontend can’t manipulate pricing
    total_price = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id", "user", "show", "movie", "movie_title", "theater_name",
            "show_time", "quantity", "total_price", "status",
            "booking_time", "ticket_qr", "created_at", "updated_at"
        ]
        extra_kwargs = {
            "user": {"read_only": True}
        }


class ReviewSerializer(serializers.ModelSerializer):
    movie_title = serializers.ReadOnlyField(source="movie.title")
    username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Review
        fields = "__all__"
