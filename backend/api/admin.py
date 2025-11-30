from django.contrib import admin
from .models import (
    Movie, Theater, Seat, Show, ShowSeat,
    Ticket, TicketSeat, Payment, Review
)


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("title", "genre", "release_date", "is_current")
    search_fields = ("title", "genre")
    list_filter = ("is_current", "genre")


class SeatInline(admin.TabularInline):
    model = Seat
    extra = 0


@admin.register(Theater)
class TheaterAdmin(admin.ModelAdmin):
    list_display = ("name", "address", "total_seats")
    search_fields = ("name",)
    inlines = [SeatInline]   


class ShowSeatInline(admin.TabularInline):
    model = ShowSeat
    extra = 1
    fields = ("seat", "is_booked")


@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    list_display = ("movie", "theater", "showtime", "price", "is_active")
    list_filter = ("theater", "movie", "is_active")
    search_fields = ("movie__title", "theater__name")
    inlines = [ShowSeatInline]


class TicketSeatInline(admin.TabularInline):
    model = TicketSeat
    extra = 0
    readonly_fields = ("seat",)


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "show", "total_price", "status", "booking_time")
    list_filter = ("status",)
    search_fields = ("id", "user__username", "show__movie__title")
    readonly_fields = ("id", "booking_time", "created_at", "updated_at", "ticket_qr")
    inlines = [TicketSeatInline]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("ticket", "amount", "method", "status", "timestamp")
    list_filter = ("status", "method")
    search_fields = ("ticket__id", "transaction_id")
    readonly_fields = ("timestamp",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("movie", "user", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("movie__title", "user__username")
