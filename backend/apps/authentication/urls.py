from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.authentication.views import AuthController

router = DefaultRouter()
router.register(r'auth', AuthController, basename='auth')

urlpatterns = [
    path('v1/', include(router.urls)),
]