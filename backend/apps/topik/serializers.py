from rest_framework import serializers
from apps.topik.models import PeriodeSemester, Topik
from apps.authentication.serializers import UserSerializer

class PeriodeSemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeriodeSemester
        fields = ['periode_semester_id', 'nama_periode', 'status_periode']


class TopikSerializer(serializers.ModelSerializer):
    dosen_detail = UserSerializer(source='user', read_only=True)
    periode_detail = PeriodeSemesterSerializer(source='periode', read_only=True)

    class Meta:
        model = Topik
        fields = ['topik_id', 'user', 'periode', 'judul', 'deskripsi', 'prasyarat', 'kuota', 'dosen_detail', 'periode_detail']
        extra_kwargs = {
            'user': {'required': False},
            'periode': {'required': False}
        }