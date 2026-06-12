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

    def get_authenticators(self):
        if getattr(self, 'action', None) in ('login', 'register'):
            return []
        from rest_framework_simplejwt.authentication import JWTAuthentication
        return [JWTAuthentication()]

    @action(
        detail=False, methods=["post"], permission_classes=[AllowAny], url_path="login"
    )
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return fail(
                message="Validasi gagal",
                errors=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = AuthService.authenticate_user(
            serializer.validated_data["nim_nip"], serializer.validated_data["password"]
        )
        if "error" in result:
            return fail(message=result["error"], status=status.HTTP_401_UNAUTHORIZED)

        return ok(data=result, message="Login berhasil")

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAuthenticated],
        url_path="logout",
    )
    def logout(self, request):
        session = AuthSession()
        session.clear_session()
        return ok(message="Logout berhasil")

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated],
        url_path="me",
    )
    def me(self, request):
        serializer = UserSerializer(request.user)
        return ok(data=serializer.data, message="Data pengguna berhasil diambil")

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[AllowAny],
        url_path="register",
    )
    def register(self, request):
        required = ['nim_nip', 'nama_lengkap', 'email', 'password', 'role']
        for field in required:
            if not request.data.get(field):
                return fail(
                    message=f"Field '{field}' wajib diisi.",
                    status=status.HTTP_400_BAD_REQUEST,
                )
        from apps.authentication.models import Users
        if Users.objects.filter(nim_nip=request.data['nim_nip']).exists():
            return fail(message="NIM/NIP sudah terdaftar.", status=status.HTTP_400_BAD_REQUEST)
        if Users.objects.filter(email=request.data['email']).exists():
            return fail(message="Email sudah terdaftar.", status=status.HTTP_400_BAD_REQUEST)

        user = UserService.register_user(request.data)
        return ok(
            data=UserSerializer(user).data,
            message="Pendaftaran berhasil. Menunggu persetujuan admin.",
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAdmin],
        url_path="pending",
    )
    def list_pending(self, request):
        users = UserService.get_pending_users()
        return ok(data=UserSerializer(users, many=True).data, message="Daftar akun pending berhasil diambil")

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdmin],
        url_path="approve",
    )
    def approve_user(self, request, pk=None):
        role = request.data.get('role')
        user = UserService.approve_user(pk, role=role)
        if not user:
            return fail(message="Pengguna tidak ditemukan", status=status.HTTP_404_NOT_FOUND)
        return ok(data=UserSerializer(user).data, message="Akun berhasil disetujui")

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAdmin],
        url_path="list-users",
    )
    def list_users(self, request):
        users = UserService.get_all_users()
        serializer = UserSerializer(users, many=True)
        return ok(
            data=serializer.data, message="Daftar semua pengguna berhasil diambil"
        )

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated],
        url_path="dosen",
    )
    def list_dosen(self, request):
        from apps.authentication.models import Users
        dosen = Users.objects.filter(role='dosen', is_active=True)
        serializer = UserSerializer(dosen, many=True)
        return ok(data=serializer.data, message="Daftar dosen berhasil diambil")

    @action(
        detail=True,
        methods=["get", "put", "delete"],
        permission_classes=[IsAdmin],
        url_path="manage",
    )
    def manage_user(self, request, pk=None):
        if request.method == "GET":
            user = UserService.get_user_by_id(pk)
            if not user:
                return fail(
                    message="Pengguna tidak ditemukan", status=status.HTTP_404_NOT_FOUND
                )
            return ok(
                data=UserSerializer(user).data,
                message="Detail pengguna berhasil diambil",
            )

        elif request.method == "PUT":
            user = UserService.update_user(pk, request.data)
            if not user:
                return fail(
                    message="Pengguna tidak ditemukan atau gagal diperbarui",
                    status=status.HTTP_404_NOT_FOUND,
                )
            return ok(
                data=UserSerializer(user).data,
                message="Data pengguna berhasil diperbarui",
            )

        elif request.method == "DELETE":
            deleted = UserService.delete_user(pk)
            if not deleted:
                return fail(message="Pengguna tidak ditemukan", status=status.HTTP_404_NOT_FOUND)
            return ok(message="Akun berhasil dihapus")

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAuthenticated],
        url_path="change-password",
    )
    def change_password(self, request):
        new_password = request.data.get("new_password", "").strip()
        if not new_password or len(new_password) < 6:
            return fail(message="Password baru minimal 6 karakter.", status=status.HTTP_400_BAD_REQUEST)
        success = UserService.change_password(request.user.pk, new_password)
        if not success:
            return fail(message="Gagal mengganti password.", status=status.HTTP_400_BAD_REQUEST)
        return ok(message="Password berhasil diperbarui.")

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdmin],
        url_path="reset-password",
    )
    def reset_password(self, request, pk=None):
        success = UserService.reset_password(pk)
        if not success:
            return fail(message="Pengguna tidak ditemukan", status=status.HTTP_404_NOT_FOUND)
        return ok(message="Password berhasil direset ke default")
