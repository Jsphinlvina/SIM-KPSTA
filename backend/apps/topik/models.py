from django.db import models
from apps.authentication.models import Users

class PeriodeSemester(models.Model):
    STATUS_CHOICES = [
        ('aktif', 'Aktif'),
        ('nonaktif', 'Nonaktif'),
    ]

    periode_semester_id = models.AutoField(primary_key=True)
    nama_periode = models.CharField(max_length=100)
    status_periode = models.CharField(max_length=10, choices=STATUS_CHOICES, default='nonaktif')

    class Meta:
        db_table = 'periode_semester'

    def __str__(self):
        return f"{self.nama_periode} ({self.status_periode})"


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