from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    MovieViewSet, ShowViewSet, TheaterViewSet,
    TicketViewSet, ReviewViewSet
)

from .views import (
    CreateUserView, MeView,
    MovieListCreate, BookingListCreate, BookingDelete
)

router = DefaultRouter()
router.register(r"movies", MovieViewSet, basename="movies")
router.register(r"shows", ShowViewSet, basename="shows")
router.register(r"theaters", TheaterViewSet, basename="theaters")
router.register(r"tickets", TicketViewSet, basename="tickets")
router.register(r"reviews", ReviewViewSet, basename="reviews")

# backwards-compatible booking endpoints
booking_list = TicketViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

booking_delete = TicketViewSet.as_view({
    'delete': 'destroy'
})

urlpatterns = [
    path("", include(router.urls)),

    # Backward compatibility
    path("bookings/", booking_list, name="booking-list"),
    path("bookings/delete/<uuid:pk>/", booking_delete, name="delete-booking"),

    path("user/register/", CreateUserView.as_view(), name="register"),
    path("user/me/", MeView.as_view(), name="me"),

    path("legacy/movies/", MovieListCreate.as_view(), name="legacy-movie-list"),
    path("legacy/bookings/", BookingListCreate.as_view(), name="legacy-booking-list"),
    path("legacy/bookings/<int:pk>/", BookingDelete.as_view(), name="legacy-delete-booking"),
]
