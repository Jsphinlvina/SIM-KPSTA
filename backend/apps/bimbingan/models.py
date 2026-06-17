from django.db import models
from apps.authentication.models import Users
from apps.pengajuan.models import PengajuanKP

class BimbinganAktif(models.Model):
    bimbingan_id = models.AutoField(primary_key=True)
    pengajuan = models.OneToOneField(PengajuanKP, on_delete=models.CASCADE, related_name='bimbingan_aktif')
    mahasiswa = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='bimbingan_mhs')
    dosen = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='bimbingan_dosen')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bimbingan_aktif'

    def __str__(self):
        return f"Bimbingan Aktif: {self.mahasiswa.nama_lengkap} -> {self.dosen.nama_lengkap}"


class ProsesPenentuan(models.Model):
    STATUS_CHOICES = (
        ('menunggu', 'menunggu'),
        ('disetujui', 'disetujui'),
        ('ditolak', 'ditolak'),
    )

    CHAIN_STAGE_CHOICES = (
        ('koordinator', 'koordinator'),
        ('dosen', 'dosen'),
        ('kaprodi', 'kaprodi'),
        ('selesai', 'selesai'),
    )

    proses_id = models.AutoField(primary_key=True)
    pengajuan = models.OneToOneField(PengajuanKP, on_delete=models.CASCADE, related_name='proses_penentuan')
    dosen_diusulkan = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='usulan_bimbingan')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='menunggu')
    tahap_chain = models.CharField(max_length=20, choices=CHAIN_STAGE_CHOICES, default='koordinator')
    catatan_penolakan = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'proses_penentuan'