from rest_framework import serializers
from apps.pengajuan.models import PengajuanKP
from apps.authentication.serializers import UserSerializer
from apps.topik.serializers import TopikSerializer, PeriodeSemesterSerializer

class PengajuanKPSerializer(serializers.ModelSerializer):
    mahasiswa_detail = UserSerializer(source='mahasiswa', read_only=True)
    topik_detail = TopikSerializer(source='topik', read_only=True)
    periode_detail = PeriodeSemesterSerializer(source='periode', read_only=True)
    has_proses = serializers.SerializerMethodField()

    def get_has_proses(self, obj):
        return hasattr(obj, 'proses_penentuan')

    class Meta:
        model = PengajuanKP
        fields = [
            'pengajuan_kp_id', 'mahasiswa', 'topik', 'periode', 'judul_diajukan',
            'deskripsi_sistem', 'status_pengajuan', 'catatan', 'created_at',
            'mahasiswa_detail', 'topik_detail', 'periode_detail', 'has_proses',
        ]
        extra_kwargs = {
            'mahasiswa': {'required': False},
            'status_pengajuan': {'read_only': True},
            'catatan': {'read_only': True},
        }