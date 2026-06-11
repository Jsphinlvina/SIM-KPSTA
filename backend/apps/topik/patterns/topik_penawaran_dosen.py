from apps.topik.patterns.abstract_topik_penawaran import AbstractTopikPenawaran
from apps.topik.models import Topik, PeriodeSemester
from rest_framework.exceptions import ValidationError

class TopikPenawaranDosen(AbstractTopikPenawaran):

    def validate_topik(self, data):
        judul = data.get('judul')
        deskripsi = data.get('deskripsi')

        if not judul or not deskripsi:
            raise ValidationError({"error": "Judul topik dan deskripsi wajib diisi."})

        if Topik.objects.filter(judul__iexact=judul).exists():
            raise ValidationError({"judul": "Judul topik ini sudah pernah ditawarkan sebelumnya."})

    def assign_periode(self):
        periode_aktif = PeriodeSemester.objects.filter(status_periode=True).first()
        if not periode_aktif:
            raise ValidationError({"error": "Tidak dapat membuat topik. Belum ada Periode Semester yang berstatus AKTIF saat ini."})
        return periode_aktif

    def save_topik(self, data, user, periode):
        topik = Topik.objects.create(
            user=user,
            periode=periode,
            judul=data.get('judul'),
            deskripsi=data.get('deskripsi'),
            prasyarat=data.get('prasyarat', '-'),
            kuota=int(data.get('kuota'))
        )
        return topik