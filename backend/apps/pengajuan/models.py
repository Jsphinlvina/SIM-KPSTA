from django.db import models
from apps.authentication.models import Users
from apps.topik.models import Topik

class PengajuanKP(models.Model):
    pengajuan_kp_id = models.AutoField(primary_key=True)
    mahasiswa = models.ForeignKey(Users, on_delete=models.CASCADE, limit_choices_to={'role': 'mahasiswa'})
    topik = models.ForeignKey(Topik, on_delete=models.SET_NULL, null=True, blank=True)
    judul_diajukan = models.CharField(max_length=255)
    deskripsi_sistem = models.TextField()
    status_pengajuan = models.CharField(max_length=25, default='draft')
    catatan = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pengajuan_kp'