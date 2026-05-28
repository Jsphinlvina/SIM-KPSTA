from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.pengajuan.views import PengajuanViewSet

router = DefaultRouter()
router.register(r'', PengajuanViewSet, basename='pengajuan')

urlpatterns = [
    path('', include(router.urls)),
]