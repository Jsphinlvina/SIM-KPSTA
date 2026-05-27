from apps.pengajuan.models import PengajuanKP
from apps.topik.models import Topik
from rest_framework.exceptions import ValidationError

class PengajuanService:

    @staticmethod
    def create_pengajuan(data, mahasiswa_user):
        topik_id = data.get('topik')
        judul_diajukan = data.get('judul_diajukan')
        deskripsi_sistem = data.get('deskripsi_sistem')

        topik_instance = None

        if topik_id:
            try:
                topik_instance = Topik.objects.get(pk=topik_id)
            except Topik.DoesNotExist:
                raise ValidationError({"topik": "Topik dosen yang Anda pilih tidak ditemukan."})

            # Validasi Kuota: Pastikan kuota topik dosen belum habis (harus > 0)
            if topik_instance.kuota <= 0:
                raise ValidationError({"topik": f"Maaf, kuota untuk topik '{topik_instance.judul}' sudah habis diklaim mahasiswa lain."})

            if not judul_diajukan:
                judul_diajukan = topik_instance.judul

        if not judul_diajukan:
            raise ValidationError({"judul_diajukan": "Judul pengajuan wajib diisi jika Anda mengambil jalur mandiri."})

        pengajuan = PengajuanKP.objects.create(
            mahasiswa=mahasiswa_user,
            topik=topik_instance,
            judul_diajukan=judul_diajukan,
            deskripsi_sistem=deskripsi_sistem
        )

        return pengajuan

    @staticmethod
    def get_riwayat_mahasiswa(mahasiswa_id):
        """Mengambil daftar seluruh riwayat judul yang pernah diajukan oleh mahasiswa ybs"""
        return PengajuanKP.objects.filter(mahasiswa_id=mahasiswa_id).select_related('topik', 'topik__user')