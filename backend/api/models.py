from django.db import models
from django.contrib.auth.models import User

class Movie(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    release_date = models.DateField(null=True, blank=True)
    price_per_ticket = models.DecimalField(max_digits=6, decimal_places=2, default=12.50)

    def __str__(self):
        return self.title

class Booking(models.Model):
    STATUS_CHOICES = [
        ('used', 'Used'),
        ('unused', 'Unused'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="bookings")
    
    theater_name = models.CharField(max_length=100, default="Lubbock Grand Cinema")
    show_time = models.DateTimeField(help_text="The selected date and time of the movie")
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unused')
    seats = models.CharField(max_length=100, blank=True)
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ticket #{self.id} - {self.movie.title}"