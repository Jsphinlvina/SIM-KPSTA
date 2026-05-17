from apps.authentication.models import Users

class UserService:
    @staticmethod
    def get_all_users():
        return Users.objects.all()

    @staticmethod
    def get_user_by_id(user_id):
        try:
            return Users.objects.get(pk=user_id)
        except Users.DoesNotExist:
            return None

    @staticmethod
    def register_user(data):
        return Users.objects.create_user(
            nim_nip=data['nim_nip'],
            email=data['email'],
            password=data['password'],
            nama_lengkap=data['nama_lengkap'],
            role=data['role']
        )

    @staticmethod
    def update_user(user_id, data):
        user = UserService.get_user_by_id(user_id)
        if not user:
            return None

        user.nama_lengkap = data.get('nama_lengkap', user.nama_lengkap)
        user.email = data.get('email', user.email)
        user.role = data.get('role', user.role)
        user.is_active = data.get('is_active', user.is_active)

        if 'password' in data and data['password']:
            user.set_password(data['password'])

        user.save()
        return user