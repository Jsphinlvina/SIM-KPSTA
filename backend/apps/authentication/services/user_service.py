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
        user = Users.objects.create_user(
            nim_nip=data['nim_nip'],
            email=data['email'],
            password=data['password'],
            nama_lengkap=data['nama_lengkap'],
            role=data['role'],
        )
        user.is_active = False
        user.save()
        return user

    @staticmethod
    def get_pending_users():
        return Users.objects.filter(is_active=False)

    @staticmethod
    def approve_user(user_id, role=None):
        user = UserService.get_user_by_id(user_id)
        if not user:
            return None
        user.is_active = True
        if role:
            user.role = role
        user.save()
        return user

    @staticmethod
    def reset_password(user_id, new_password='password123'):
        user = UserService.get_user_by_id(user_id)
        if not user:
            return False
        user.set_password(new_password)
        user.must_change_password = True
        user.save()
        return True

    @staticmethod
    def change_password(user_id, new_password):
        user = UserService.get_user_by_id(user_id)
        if not user:
            return False
        user.set_password(new_password)
        user.must_change_password = False
        user.save()
        return True

    @staticmethod
    def delete_user(user_id):
        user = UserService.get_user_by_id(user_id)
        if not user:
            return False
        user.delete()
        return True

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