from apps.topik.models import PeriodeSemester
from rest_framework.exceptions import ValidationError

class PeriodeService:

    @staticmethod
    def create_periode(data):
        status = data.get('status_periode', 'nonaktif')
        if status == 'aktif':
            PeriodeSemester.objects.filter(status_periode='aktif').update(status_periode='nonaktif')

        return PeriodeSemester.objects.create(**data)

    @staticmethod
    def get_all_periode():
        return PeriodeSemester.objects.all()

    @staticmethod
    def get_active_periode():
        return PeriodeSemester.objects.filter(status_periode='aktif').first()