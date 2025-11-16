from django.urls import path
from . import views

urlpatterns = [
    # Movies
    path("movies/", views.MovieListCreate.as_view(), name="movie-list"),

    # Bookings
    path("bookings/", views.BookingListCreate.as_view(), name="booking-list"),
    path("bookings/delete/<int:pk>/", views.BookingDelete.as_view(), name="delete-booking"),
]
