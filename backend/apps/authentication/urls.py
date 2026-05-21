from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from apps.authentication.views import AuthController

router = DefaultRouter()
router.register(r'', AuthController, basename='auth-users')

urlpatterns = [
    path('v1/auth/', include(router.urls)),

    path('v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('v1/users/', AuthController.as_view({'get': 'list_users'}), name='user_list'),
    path('v1/users/<int:pk>/', AuthController.as_view({'get': 'manage_user', 'put': 'manage_user'}),
         name='user_detail'),
]