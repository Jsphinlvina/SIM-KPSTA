from django.contrib import admin
from django.urls import include, path

api_v1 = [
    path('', include('apps.schedule.urls')),
    path('document/', include('apps.document.urls')),
    path('notification/', include('apps.notification.urls')),
    path('archive/', include('apps.archive.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/', include('apps.topik.urls')),
    path('api/v1/', include('apps.pengajuan.urls')),
    path('api/v1/', include(api_v1)),
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/', include('apps.topik.urls')),
]
