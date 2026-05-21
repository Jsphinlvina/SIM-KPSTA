from apps.topik.patterns.topik_penawaran_dosen import TopikPenawaranDosen
from apps.topik.models import Topik

class TopikService:

    @staticmethod
    def create_topik_penawaran(data, user):
        handler = TopikPenawaranDosen()
        return handler.proses_penawaran(data, user)

    @staticmethod
    def get_all_topik():
        return Topik.objects.all().select_related('user', 'periode')

    @staticmethod
    def get_available_topik():
        return Topik.objects.filter(kuota__gt=0).select_related('user', 'periode')

    @staticmethod
    def get_topik_by_dosen(dosen_id):
        return Topik.objects.filter(user_id=dosen_id).select_related('user', 'periode')