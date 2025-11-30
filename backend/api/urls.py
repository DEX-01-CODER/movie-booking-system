from django.urls import path
from .views import (
    CreateUserView,
    MovieListCreate,
    BookingListCreate,
    BookingDelete,
    MeView,

)

urlpatterns = [
    # User registration
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("user/me/", MeView.as_view(), name="me"),
    

    # Movies
    path("movies/", MovieListCreate.as_view(), name="movie-list"),

    # Bookings
    path("bookings/", BookingListCreate.as_view(), name="booking-list"),
    path("bookings/<int:pk>/", BookingDelete.as_view(), name="delete-booking"),
]
