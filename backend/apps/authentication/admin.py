from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from apps.authentication.models import Users

class CustomUserAdmin(UserAdmin):
    model = Users
    list_display = ['nim_nip', 'nama_lengkap', 'email', 'role', 'is_staff', 'is_active']
    list_filter = ['role', 'is_staff', 'is_active']
    fieldsets = (
        (None, {'fields': ('nim_nip', 'password')}),
        ('Informasi Pribadi', {'fields': ('nama_lengkap', 'email', 'role')}),
        ('Hak Akses/Status', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    search_fields = ['nim_nip', 'nama_lengkap', 'email']
    ordering = ['nim_nip']

admin.site.register(Users, CustomUserAdmin)