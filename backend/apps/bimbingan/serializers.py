from rest_framework import serializers
from apps.bimbingan.models import BimbinganAktif, ProsesPenentuan
from apps.authentication.serializers import UserSerializer
from apps.pengajuan.serializers import PengajuanKPSerializer

class BimbinganAktifSerializer(serializers.ModelSerializer):
    mahasiswa_detail = UserSerializer(source='mahasiswa', read_only=True)
    dosen_detail = UserSerializer(source='dosen', read_only=True)
    pengajuan_detail = PengajuanKPSerializer(source='pengajuan', read_only=True)

    class Meta:
        model = BimbinganAktif
        fields = '__all__'

class ProsesPenentuanSerializer(serializers.ModelSerializer):
    dosen_detail = UserSerializer(source='dosen_diusulkan', read_only=True)
    pengajuan_detail = PengajuanKPSerializer(source='pengajuan', read_only=True)

    class Meta:
        model = ProsesPenentuan
        fields = '__all__'