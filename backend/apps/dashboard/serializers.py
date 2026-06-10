from rest_framework import serializers


class MahasiswaBimbinganSerializer(serializers.Serializer):
    mahasiswa_id = serializers.IntegerField()
    nama = serializers.CharField()
    nim = serializers.CharField()
    topik = serializers.CharField()


class DistribusiDosenSerializer(serializers.Serializer):
    dosen_id = serializers.IntegerField()
    nama_dosen = serializers.CharField()
    jumlah_mahasiswa = serializers.IntegerField()
    mahasiswa = MahasiswaBimbinganSerializer(many=True)


class ChartDataSerializer(serializers.Serializer):
    labels = serializers.ListField(child=serializers.CharField())
    values = serializers.ListField(child=serializers.IntegerField())


class SummarySerializer(serializers.Serializer):
    total_dosen_pembimbing = serializers.IntegerField()
    total_mahasiswa_bimbingan = serializers.IntegerField()
    rata_rata_mahasiswa_per_dosen = serializers.FloatField()
