from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.authentication.views import AuthController

auth = AuthController.as_view({
    'post': 'login',
})

urlpatterns = [
    path('login/', AuthController.as_view({'post': 'login'}), name='login'),
    path('logout/', AuthController.as_view({'post': 'logout'}), name='logout'),
    path('me/', AuthController.as_view({'get': 'me'}), name='me'),
    path('register/', AuthController.as_view({'post': 'register'}), name='register'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', AuthController.as_view({'get': 'list_users'}), name='user_list'),
    path('change-password/', AuthController.as_view({'post': 'change_password'}), name='change_password'),
    path('users/pending/', AuthController.as_view({'get': 'list_pending'}), name='user_pending'),
    path('users/<int:pk>/', AuthController.as_view({'get': 'manage_user', 'put': 'manage_user', 'delete': 'manage_user'}), name='user_detail'),
    path('users/<int:pk>/approve/', AuthController.as_view({'post': 'approve_user'}), name='user_approve'),
    path('users/<int:pk>/reset-password/', AuthController.as_view({'post': 'reset_password'}), name='user_reset_password'),
    path('dosen/', AuthController.as_view({'get': 'list_dosen'}), name='dosen_list'),
]