from django.contrib import admin
from .models import Movie, Show, Theater, Ticket, Review


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("title", "genre", "release_date", "is_current")
    search_fields = ("title", "genre")
    list_filter = ("is_current", "genre")


@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    list_display = ("movie", "theater", "showtime", "price")
    list_filter = ("theater", "movie")
    search_fields = ("movie__title", "theater__name")

@admin.register(Theater)
class TheaterAdmin(admin.ModelAdmin):
    list_display = ("name", "address")
    search_fields = ("name",)

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "show", "quantity", "total_price", "status", "booking_time")
    list_filter = ("status")
    search_fields = ("id", "user__username", "show__movie__title")

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("movie", "user", "rating", "created_at")
    list_filter = ("rating")
    search_fields = ("movie__title", "user__username")