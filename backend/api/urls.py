from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MovieViewSet,
    ShowViewSet,
    TheaterViewSet,
    TicketViewSet,
    ReviewViewSet,
)

router = DefaultRouter()
router.register(r"movies", MovieViewSet, basename="movies")
router.register(r"shows", ShowViewSet, basename="shows")
router.register(r"theaters", TheaterViewSet, basename="theaters")
router.register(r"tickets", TicketViewSet, basename="tickets")
router.register(r"reviews", ReviewViewSet, basename="reviews")

# Backwards compatibility for old frontend
booking_list = TicketViewSet.as_view({
    "get": "list",
    "post": "create",
})

booking_delete = TicketViewSet.as_view({
    "delete": "destroy",
})

urlpatterns = [
    path("", include(router.urls)),
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("user/me/", MeView.as_view(), name="me"),

    # Old booking endpoints (safe to keep)
    path("bookings/", booking_list, name="booking-list"),
    path(
        "bookings/delete/<uuid:pk>/",
        booking_delete,
        name="delete-booking"
    ),
]