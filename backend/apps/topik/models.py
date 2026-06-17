from django.db import models
from apps.authentication.models import Users

class PeriodeSemester(models.Model):
    periode_semester_id = models.AutoField(primary_key=True)
    nama_periode = models.CharField(max_length=100, unique=True)
    status_periode = models.BooleanField(default=False)

    class Meta:
        db_table = 'periode_semester'

    def __str__(self):
        return f"{self.nama_periode} ({'Aktif' if self.status_periode else 'Nonaktif'})"


class Topik(models.Model):
    topik_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, limit_choices_to={'role': 'dosen'})
    periode = models.ForeignKey(PeriodeSemester, on_delete=models.CASCADE)
    judul = models.CharField(max_length=255, unique=True)
    deskripsi = models.TextField()
    prasyarat = models.TextField()
    kuota = models.IntegerField()

    class Meta:
        db_table = 'topik'

    def __str__(self):
        return f"{self.judul} - Kuota: {self.kuota}"