from rest_framework import serializers
from apps.authentication.models import Users


class LoginSerializer(serializers.Serializer):
    nim_nip = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user_id', 'nim_nip', 'nama_lengkap', 'email', 'role', 'is_active']
        read_only_fields = ['user_id']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }