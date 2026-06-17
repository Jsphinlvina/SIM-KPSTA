from rest_framework_simplejwt.tokens import RefreshToken
from apps.authentication.patterns.auth_session import AuthSession
from apps.authentication.models import Users


class AuthService:
    @staticmethod
    def authenticate_user(nim_nip, password):
        try:
            user = Users.objects.get(nim_nip=nim_nip)
        except Users.DoesNotExist:
            return {"error": "USER_NOT_FOUND"}

        if not user.is_active:
            return {"error": "PENDING_APPROVAL"}

        if not user.check_password(password):
            return {"error": "WRONG_PASSWORD"}

        session = AuthSession()
        session.set_session(user)

        refresh = RefreshToken.for_user(user)

        return {
            "user": {
                "user_id": user.user_id,
                "nim_nip": user.nim_nip,
                "nama_lengkap": user.nama_lengkap,
                "role": user.role,
                "email": user.email,
                "must_change_password": user.must_change_password,
            },
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh)
        }