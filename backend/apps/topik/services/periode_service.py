from apps.topik.models import PeriodeSemester
from rest_framework.exceptions import ValidationError


class PeriodeService:

    @staticmethod
    def create_periode(data):
        nama = data.get('nama_periode', '').strip()
        if not nama:
            raise ValidationError("Nama periode tidak boleh kosong.")
        if PeriodeSemester.objects.filter(nama_periode=nama).exists():
            raise ValidationError(f"Periode '{nama}' sudah terdaftar.")
        return PeriodeSemester.objects.create(nama_periode=nama, status_periode=False)

    @staticmethod
    def get_all_periode():
        return PeriodeSemester.objects.all().order_by('-periode_semester_id')

    @staticmethod
    def get_active_periode():
        return PeriodeSemester.objects.filter(status_periode=True).first()

    @staticmethod
    def activate_periode(periode_id):
        active = PeriodeSemester.objects.filter(status_periode=True).exclude(pk=periode_id).first()
        if active:
            raise ValidationError(
                f"Periode '{active.nama_periode}' masih aktif. Nonaktifkan terlebih dahulu sebelum mengaktifkan periode lain."
            )
        periode = PeriodeSemester.objects.filter(pk=periode_id).first()
        if not periode:
            return None
        periode.status_periode = True
        periode.save()
        return periode

    @staticmethod
    def deactivate_periode(periode_id):
        periode = PeriodeSemester.objects.filter(pk=periode_id).first()
        if not periode:
            return None
        periode.status_periode = False
        periode.save()
        return periode

    @staticmethod
    def update_periode(periode_id, data):
        periode = PeriodeSemester.objects.filter(pk=periode_id).first()
        if not periode:
            return None
        nama = data.get('nama_periode', periode.nama_periode).strip()
        if PeriodeSemester.objects.filter(nama_periode=nama).exclude(pk=periode_id).exists():
            raise ValidationError(f"Periode '{nama}' sudah terdaftar.")
        periode.nama_periode = nama
        periode.save()
        return periode

    @staticmethod
    def delete_periode(periode_id):
        from apps.topik.models import Topik
        if Topik.objects.filter(periode_id=periode_id).exists():
            raise ValidationError("Periode ini tidak dapat dihapus karena masih memiliki topik yang terkait.")
        periode = PeriodeSemester.objects.filter(pk=periode_id).first()
        if not periode:
            return False
        periode.delete()
        return True