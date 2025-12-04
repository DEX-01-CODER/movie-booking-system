from rest_framework import serializers
from .models import (
    Movie, Show, Theater, Seat, ShowSeat,
    Ticket, TicketSeat, Payment, Review, UserProfile
)
from django.contrib.auth.models import User


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    # Use first_name as "full_name" for simplicity
    full_name = serializers.CharField(source="first_name", required=False)

    # These are fields we *write* via the serializer and also *read* from UserProfile
    phone_number = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "phone_number",
            "address",
            "password",
            "is_staff",
        ]
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 6},
        }

    def create(self, validated_data):
        """
        Create a new User + UserProfile.
        - full_name is mapped to first_name via source="first_name"
        - phone_number / address are stored on UserProfile
        """
        phone = validated_data.pop("phone_number", "")
        address = validated_data.pop("address", "")
        password = validated_data.pop("password", None)

        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()

        # Create or update the related UserProfile
        UserProfile.objects.update_or_create(
            user=user,
            defaults={
                "phone_number": phone,
                "address": address,
            },
        )
        return user

    def update(self, instance, validated_data):
        """
        Update User + UserProfile from profile page.
        """
        phone = validated_data.pop("phone_number", None)
        address = validated_data.pop("address", None)
        password = validated_data.pop("password", None)

        # Update base User fields (username, email, first_name, etc.)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        # Update profile data if provided
        if phone is not None or address is not None:
            profile, _ = UserProfile.objects.get_or_create(user=instance)
            if phone is not None:
                profile.phone_number = phone
            if address is not None:
                profile.address = address
            profile.save()

        return instance

    def to_representation(self, instance):
        """
        When sending data to the frontend, pull phone/address
        from the related UserProfile.
        """
        rep = super().to_representation(instance)
        profile = getattr(instance, "profile", None)

        if profile:
            rep["phone_number"] = profile.phone_number
            rep["address"] = profile.address
        else:
            rep["phone_number"] = ""
            rep["address"] = ""

        return rep


class MovieSerializer(serializers.ModelSerializer):
    description = serializers.CharField(source="synopsis")

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "description",
            "cast",
            "genre",
            "runtime_minutes",
            "release_date",
            "rating",
            "poster_url",
            "trailer_url",
            "is_current",
            "created_at",
            "updated_at",
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
            "id",
            "movie",
            "movie_title",
            "theater",
            "theater_name",
            "showtime",
            "price",
            "is_active",
            "created_at",
            "updated_at",
            "show_seats",
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
            "id",
            "user",
            "show",
            "movie_title",
            "theater_name",
            "show_time",
            "seats",
            "total_price",
            "status",
            "booking_time",
            "ticket_qr",
            "created_at",
            "updated_at",
            "cancelled_at",
            "cancellation_reason",
            "refund_amount",
        ]
        extra_kwargs = {
            "user": {"read_only": True},
        }


class PaymentSerializer(serializers.ModelSerializer):
    ticket_id = serializers.CharField(source="ticket.id", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "ticket",
            "ticket_id",
            "amount",
            "method",
            "status",
            "transaction_id",
            "timestamp",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    movie_title = serializers.ReadOnlyField(source="movie.title")
    username = serializers.ReadOnlyField(source="user.username")
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = "__all__"
