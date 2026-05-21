from django.contrib import admin

from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'document_type', 'bimbingan_aktif_id', 'uploaded_by', 'file_name', 'status']
    list_filter = ['document_type', 'status']
    search_fields = ['file_name']
