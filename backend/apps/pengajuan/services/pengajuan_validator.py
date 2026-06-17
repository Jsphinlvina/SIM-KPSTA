from rest_framework.exceptions import ValidationError
from apps.topik.models import Topik

class PengajuanValidator:
    
    @staticmethod
    def validate_topik_dosen(topik_id):
        if not topik_id:
            raise ValidationError({"topik": "ID topik dosen wajib disertakan."})
        try:
            topik = Topik.objects.get(pk=topik_id)
        except Topik.DoesNotExist:
            raise ValidationError({"topik": "Topik dosen tidak ditemukan."})
            
        if topik.kuota <= 0:
            raise ValidationError({"topik": f"Kuota untuk topik '{topik.judul}' telah habis."})
        return topik

    @staticmethod
    def validate_mandiri(judul, deskripsi):
        if not judul or not deskripsi:
            raise ValidationError({"error": "Judul mandiri dan deskripsi sistem wajib diisi."})