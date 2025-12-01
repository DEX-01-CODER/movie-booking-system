from rest_framework import serializers
from .models import (
    Movie, Show, Theater, Seat, ShowSeat,
    Ticket, TicketSeat, Payment, Review, UserProfile
)
from django.contrib.auth.models import User


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="first_name", required=False)
    phone_number = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "phone_number", "address", "password", "is_staff"]
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 6}
        }

    def get_phone_number(self, obj):
        return obj.profile.phone_number if hasattr(obj, 'profile') else None
    
    def get_address(self, obj):
        return obj.profile.address if hasattr(obj, 'profile') else None

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        # Create UserProfile
        UserProfile.objects.get_or_create(user=user)
        return user



class MovieSerializer(serializers.ModelSerializer):
    description = serializers.CharField(source="synopsis")

    class Meta:
        model = Movie
        fields = [
            "id", "title", "description", "cast", "genre",
            "runtime_minutes", "release_date", "rating",
            "poster_url", "trailer_url", "is_current",
            "created_at", "updated_at"
        ]



class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ["id", "theater", "seat_number", "seat_type"]


class TheaterSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True, read_only=True)

    class Meta:
        model = Theater
        fields = ["id", "name", "address", "total_seats", "seats"]



class ShowSeatSerializer(serializers.ModelSerializer):
    seat_number = serializers.CharField(source="seat.seat_number", read_only=True)
    seat_type = serializers.CharField(source="seat.seat_type", read_only=True)

    class Meta:
        model = ShowSeat
        fields = ["id", "show", "seat", "seat_number", "seat_type", "is_booked"]


class ShowSerializer(serializers.ModelSerializer):
    movie_title = serializers.ReadOnlyField(source="movie.title")
    theater_name = serializers.ReadOnlyField(source="theater.name")
    show_seats = ShowSeatSerializer(many=True, read_only=True)

    class Meta:
        model = Show
        fields = [
            "id", "movie", "movie_title", "theater", "theater_name",
            "showtime", "price", "is_active", "created_at", "updated_at",
            "show_seats"
        ]



class TicketSeatSerializer(serializers.ModelSerializer):
    seat_number = serializers.CharField(source="seat.seat_number", read_only=True)
    seat_type = serializers.CharField(source="seat.seat_type", read_only=True)

    class Meta:
        model = TicketSeat
        fields = ["id", "seat_number", "seat_type"]


class TicketSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source="show.movie.title", read_only=True)
    theater_name = serializers.CharField(source="show.theater.name", read_only=True)
    show_time = serializers.DateTimeField(source="show.showtime", read_only=True)
    seats = TicketSeatSerializer(source="ticket_seats", many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)
    status = serializers.CharField(read_only=True)
    refund_amount = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)
    cancelled_at = serializers.DateTimeField(read_only=True)
    cancellation_reason = serializers.CharField(read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id", "user", "show", "movie_title", "theater_name",
            "show_time", "seats", "total_price", "status",
            "booking_time", "ticket_qr", "created_at", "updated_at",
            "cancelled_at", "cancellation_reason", "refund_amount"
        ]
        extra_kwargs = {
            "user": {"read_only": True}
        }



class PaymentSerializer(serializers.ModelSerializer):
    ticket_id = serializers.CharField(source="ticket.id", read_only=True)

    class Meta:
        model = Payment
        fields = ["id", "ticket", "ticket_id", "amount", "method", "status", "transaction_id", "timestamp"]


class ReviewSerializer(serializers.ModelSerializer):
    movie_title = serializers.ReadOnlyField(source="movie.title")
    username = serializers.ReadOnlyField(source="user.username")
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = "__all__"
