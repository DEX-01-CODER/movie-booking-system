from django.db import models
from django.contrib.auth.models import User
import uuid

class Movie(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    title = models.CharField(max_length = 255)
    synopsis = models.TextField()
    cast = models.JSONField(default = list)
    genre = models.CharField(max_length = 50)
    runtime_minutes = models.IntegerField()
    release_date = models.DateField()
    rating = models.FloatField(default = 0.0)
    poster_url = models.URLField()
    trailer_url = models.URLField(blank = True, null = True)
    is_current = models.BooleanField(default = True)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

    def __str__(self):
        return self.title

class Theater(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    name = models.CharField(max_length = 255)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

    def __str__(self):
        return self.name


class Show(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    movie = models.ForeignKey(Movie, on_delete = models.CASCADE, related_name = 'shows')
    theater = models.ForeignKey(Theater, on_delete = models.CASCADE, related_name = 'shows')
    showtime = models.DateTimeField()
    price = models.DecimalField(max_digits = 6, decimal_places = 2)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

    def __str__(self):
        return f"{self.movie.title} @ {self.theater.name} ({self.showtime})"
    

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
        ('used', 'Used')
    ]
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'tickets')
    show = models.ForeignKey(Show, on_delete = models.CASCADE, related_name = 'tickets')
    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits = 8, decimal_places = 2)
    status = models.CharField(max_length = 10, choices = STATUS_CHOICES, default = 'paid')
    booking_time = models.DateTimeField(auto_now_add = True)
    ticket_qr = models.TextField(blank = True)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)
    
    def __str__(self):
        return f"Ticket {self.id} - {self.show.movie.title}"
    

class Review(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete = models.CASCADE, related_name = 'reviews')
    rating = models.FloatField()
    comment = models.TextField(blank = True)
    created_at = models.DateTimeField(auto_now_add = True)  

    def __str__(self):
        return f"{self.movie.title} - {self.rating}/10"