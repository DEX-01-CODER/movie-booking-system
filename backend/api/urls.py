from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    MovieViewSet, ShowViewSet, TheaterViewSet,
    TicketViewSet, ReviewViewSet, SeatViewSet, ShowSeatViewSet,
    CreateUserView, MeView, UpdateUserProfileView, ChangePasswordView
)


router = DefaultRouter()
router.register(r"movies", MovieViewSet, basename="movies")
router.register(r"shows", ShowViewSet, basename="shows")
router.register(r"theaters", TheaterViewSet, basename="theaters")
router.register(r"seats", SeatViewSet, basename="seats")
router.register(r"show-seats", ShowSeatViewSet, basename="show-seats")
router.register(r"tickets", TicketViewSet, basename="tickets")
router.register(r"reviews", ReviewViewSet, basename="reviews")

booking_list = TicketViewSet.as_view({
    "get": "list",
    "post": "create",
})

booking_delete = TicketViewSet.as_view({
    "delete": "destroy",
})



urlpatterns = [
    # User
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("user/me/", MeView.as_view(), name="me"),
    path("user/update-profile/", UpdateUserProfileView.as_view(), name="update-profile"),
    path("user/change-password/", ChangePasswordView.as_view(), name="change-password"),

    # router routes
    path("", include(router.urls)),

    # Backward compatibility for ticket endpoints
    path("bookings/", booking_list, name="booking-list"),
    path("bookings/delete/<uuid:pk>/", booking_delete, name="delete-booking"),
]
