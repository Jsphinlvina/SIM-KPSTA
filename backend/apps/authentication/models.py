from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, nim_nip, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email wajib diisi')
        if not nim_nip:
            raise ValueError('NIM/NIP wajib diisi')

        email = self.normalize_email(email)
        user = self.model(nim_nip=nim_nip, email=email, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, nim_nip, email, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(nim_nip, email, password, **extra_fields)


class Users(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('mahasiswa', 'mahasiswa'),
        ('dosen', 'dosen'),
        ('koordinator', 'koordinator'),
        ('kaprodi', 'kaprodi'),
        ('admin', 'admin'),
    )

    user_id = models.AutoField(primary_key=True)
    nim_nip = models.CharField(max_length=50, unique=True)
    nama_lengkap = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'nim_nip'
    REQUIRED_FIELDS = ['email', 'nama_lengkap']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.nim_nip} - {self.nama_lengkap} ({self.role})"