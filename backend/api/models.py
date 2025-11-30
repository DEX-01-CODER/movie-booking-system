from django.db import models
from django.contrib.auth.models import User


class Movie(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    release_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title



class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="bookings")
    seats = models.CharField(max_length=100)
    # SIMPLE TEMPLATE: "A1,A2,A3"

    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} by {self.user.username} for {self.movie.title}" # type: ignore
