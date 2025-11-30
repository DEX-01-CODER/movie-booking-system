from django.db import models
from django.contrib.auth.models import User
import uuid

class Movie(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    synopsis = models.TextField()
    cast = models.JSONField(default=list)
    genre = models.CharField(max_length=50)
    runtime_minutes = models.IntegerField()
    release_date = models.DateField()
    rating = models.FloatField(default=0.0)
    poster_url = models.URLField()
    trailer_url = models.URLField(blank=True, null=True)
    is_current = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Theater(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    address = models.TextField()
    total_seats = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Seat(models.Model):
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, related_name="seats")
    seat_number = models.CharField(max_length=10)   # e.g., A1, B10
    seat_type = models.CharField(max_length=20, default="regular")  # regular/VIP

    class Meta:
        unique_together = ("theater", "seat_number")

    def __str__(self):
        return f"{self.seat_number} ({self.theater.name})"


class Show(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="shows")
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, related_name="shows")
    showtime = models.DateTimeField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    is_active = models.BooleanField(default=True)   # soft delete for shows
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.movie.title} @ {self.theater.name} ({self.showtime})"



class ShowSeat(models.Model):
    show = models.ForeignKey(Show, on_delete=models.CASCADE, related_name="show_seats")
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    is_booked = models.BooleanField(default=False)

    class Meta:
        unique_together = ("show", "seat")

    def __str__(self):
        return f"{self.show} - {self.seat.seat_number} ({'Booked' if self.is_booked else 'Available'})"


class Ticket(models.Model):
    STATUS_CHOICES = [
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
        ('used', 'Used')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tickets")
    show = models.ForeignKey(Show, on_delete=models.CASCADE, related_name="tickets")
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='paid')
    booking_time = models.DateTimeField(auto_now_add=True)
    ticket_qr = models.TextField(blank=True)  # QR code string data
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ticket {self.id} - {self.show.movie.title}"



class TicketSeat(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name="ticket_seats")
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.ticket.id} - {self.seat.seat_number}"


class Payment(models.Model):
    ticket = models.OneToOneField(Ticket, on_delete=models.CASCADE, related_name="payment")
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    method = models.CharField(max_length=50)  # e.g. 'card', 'esewa', 'khalti'
    status = models.CharField(max_length=20, default="pending")  # pending/failed/success
    transaction_id = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Ticket {self.ticket.id} - {self.status}"


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="reviews")
    rating = models.FloatField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.movie.title} - {self.rating}/10"
