from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from core.permissions import IsAdmin
from core.responses import ok, fail
from apps.authentication.serializers import LoginSerializer, UserSerializer
from apps.authentication.services.auth_service import AuthService
from apps.authentication.services.user_service import UserService
from apps.authentication.patterns.auth_session import AuthSession


class AuthController(viewsets.ViewSet):


    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='login')
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return fail(message="Validasi gagal", errors=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        result = AuthService.authenticate_user(serializer.validated_data['nim_nip'],
                                               serializer.validated_data['password'])
        if result is None:
            return fail(message="NIM/NIP atau password salah", status=status.HTTP_401_UNAUTHORIZED)
        if "error" in result:
            return fail(message=result["error"], status=status.HTTP_403_FORBIDDEN)

        return ok(data=result, message="Login berhasil")

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='logout')
    def logout(self, request):
        session = AuthSession()
        session.clear_session()
        return ok(message="Logout berhasil")

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='me')
    def me(self, request):
        serializer = UserSerializer(request.user)
        return ok(data=serializer.data, message="Data pengguna berhasil diambil")

    @action(detail=False, methods=['post'], permission_classes=[IsAdmin], url_path='register')
    def register(self, request):
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return fail(message="Validasi pendaftaran gagal", errors=serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

        user = UserService.register_user(request.data)
        return ok(data=UserSerializer(user).data, message="Pengguna baru berhasil didaftarkan",
                  status=status.HTTP_201_CREATED)


    @action(detail=False, methods=['get'], permission_classes=[IsAdmin], url_path='list-users')
    def list_users(self, request):
        users = UserService.get_all_users()
        serializer = UserSerializer(users, many=True)
        return ok(data=serializer.data, message="Daftar semua pengguna berhasil diambil")

    @action(detail=True, methods=['get', 'put'], permission_classes=[IsAdmin], url_path='manage')
    def manage_user(self, request, pk=None):
        if request.method == 'GET':
            user = UserService.get_user_by_id(pk)
            if not user:
                return fail(message="Pengguna tidak ditemukan", status=status.HTTP_404_NOT_FOUND)
            return ok(data=UserSerializer(user).data, message="Detail pengguna berhasil diambil")

        elif request.method == 'PUT':
            user = UserService.update_user(pk, request.data)
            if not user:
                return fail(message="Pengguna tidak ditemukan atau gagal diperbarui", status=status.HTTP_404_NOT_FOUND)
            return ok(data=UserSerializer(user).data, message="Data pengguna berhasil diperbarui")