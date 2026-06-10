from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.laporan.views import LaporanViewSet

router = DefaultRouter()
router.register(r'', LaporanViewSet, basename='laporan')

urlpatterns = [
    path('', include(router.urls)),
]
