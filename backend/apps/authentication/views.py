from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
# SESUAIKAN IMPORT DENGAN FUNGSI YANG ADA
from core.responses import ok, fail
from apps.authentication.serializers import LoginSerializer
from apps.authentication.services.auth_service import AuthService
from apps.authentication.patterns.auth_session import AuthSession


class AuthController(viewsets.ViewSet):

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='login')
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            # Menggunakan fungsi fail() bawaan proyek
            return fail(message="Validasi gagal", errors=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        nim_nip = serializer.validated_data['nim_nip']
        password = serializer.validated_data['password']

        result = AuthService.authenticate_user(nim_nip, password)

        if result is None:
            return fail(message="NIM/NIP atau password salah", status=status.HTTP_401_UNAUTHORIZED)

        if "error" in result:
            return fail(message=result["error"], status=status.HTTP_403_FORBIDDEN)

        # Menggunakan fungsi ok() bawaan proyek
        return ok(data=result, message="Login berhasil")

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='logout')
    def logout(self, request):
        session = AuthSession()
        session.clear_session()
        return ok(message="Logout berhasil")

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='me')
    def me(self, request):
        user = request.user
        data = {
            "user_id": user.user_id,
            "nim_nip": user.nim_nip,
            "nama_lengkap": user.nama_lengkap,
            "role": user.role,
            "email": user.email
        }
        return ok(data=data, message="Data pengguna berhasil diambil")