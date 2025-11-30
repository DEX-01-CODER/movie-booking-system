from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MovieViewSet, ShowViewSet, TheaterViewSet, TicketViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r"movies", MovieViewSet, basename = "movies")
router.register(r"shows", ShowViewSet, basename = "shows")
router.register(r"theaters", TheaterViewSet, basename = "theaters")
router.register(r"tickets", TicketViewSet, basename = "tickets")
router.register(r"reviews", ReviewViewSet, basename = "reviews")

booking_list = TicketViewSet.as_view({
    'get' : 'list',
    'post' : 'create',
})

booking_delete = TicketViewSet.as_view({
    'delete': 'destroy'
})

urlpatterns = [
    path("", include(router.urls)),

    # backward-compatibility 
    path("bookings/", booking_list, name = "booking-list"),
    path("bookings/delete/<uuid:pk>/", booking_delete, name = "delete-booking"),
]