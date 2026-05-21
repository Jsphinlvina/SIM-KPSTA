from django.contrib import admin
from apps.topik.models import PeriodeSemester, Topik

@admin.register(PeriodeSemester)
class PeriodeSemesterAdmin(admin.ModelAdmin):
    list_display = ['periode_semester_id', 'nama_periode', 'status_periode']
    list_filter = ['status_periode']
    search_fields = ['nama_periode']

@admin.register(Topik)
class TopikAdmin(admin.ModelAdmin):
    list_display = ['topik_id', 'judul', 'user', 'periode', 'kuota']
    list_filter = ['periode', 'user']
    search_fields = ['judul', 'deskripsi']