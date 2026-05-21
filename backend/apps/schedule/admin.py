from django.contrib import admin

from .models import ScheduleEvent


@admin.register(ScheduleEvent)
class ScheduleEventAdmin(admin.ModelAdmin):
    list_display = ['id', 'event_type', 'bimbingan_aktif_id', 'lecturer_id', 'date', 'time', 'status']
    list_filter = ['event_type', 'status']
    search_fields = ['location', 'notes']
