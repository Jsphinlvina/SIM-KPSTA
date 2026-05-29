from django.contrib import admin

from .models import ArchiveRecord


@admin.register(ArchiveRecord)
class ArchiveRecordAdmin(admin.ModelAdmin):
    list_display = ['id', 'source_type', 'source_id', 'title', 'state', 'created_at']
    list_filter = ['source_type', 'state']
    search_fields = ['title']
