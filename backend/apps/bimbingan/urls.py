from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.bimbingan.views import BimbinganViewSet

router = DefaultRouter()
router.register(r'', BimbinganViewSet, basename='bimbingan')

urlpatterns = [
    path('', include(router.urls)),
]