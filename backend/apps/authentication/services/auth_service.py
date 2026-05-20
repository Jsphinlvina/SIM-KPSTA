from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from apps.authentication.patterns.auth_session import AuthSession


class AuthService:
    @staticmethod
    def authenticate_user(nim_nip, password):
        user = authenticate(username=nim_nip, password=password)

        if not user:
            return None

        if not user.is_active:
            return {"error": "Akun Anda sudah tidak aktif"}

        session = AuthSession()
        session.set_session(user)

        refresh = RefreshToken.for_user(user)

        return {
            "user": {
                "user_id": user.user_id,
                "nim_nip": user.nim_nip,
                "nama_lengkap": user.nama_lengkap,
                "role": user.role,
                "email": user.email
            },
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh)
        }