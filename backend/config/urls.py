from django.contrib import admin
from django.urls import include, path

api = [
    path('', include('apps.schedule.urls')),
    path('document/', include('apps.document.urls')),
    path('notification/', include('apps.notification.urls')),
    path('archive/', include('apps.archive.urls')),
    path('topik/', include('apps.topik.urls')),
    path('pengajuan/', include('apps.pengajuan.urls')),
<<<<<<< HEAD
    path('bimbingan/', include('apps.bimbingan.urls')),
=======
>>>>>>> Week-4-2272002-Joshua-Subianto
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/', include(api)),
]
