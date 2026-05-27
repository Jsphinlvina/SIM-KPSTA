from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.pengajuan.views import PengajuanKPViewSet

router = DefaultRouter()
router.register(r'judul', PengajuanKPViewSet, basename='judul-pengajuan')

urlpatterns = [
    path('', include(router.urls)),
]