from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MovieViewSet, ShowViewSet, TheaterViewSet, TicketViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r"movies", MovieViewSet, basename = "movies")
router.register(r"shows", ShowViewSet, basename = "shows")
router.register(r"theaters", TheaterViewSet, basename = "theaters")
router.register(r"tickets", TicketViewSet, basename = "tickets")
router.register(r"reviews", ReviewViewSet, basename = "reviews")


urlpatterns = [
    path("", include(router.urls)),
]
