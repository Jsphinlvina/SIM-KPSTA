from apps.pengajuan.patterns.factory.pengajuan_factory import PengajuanFactory
from apps.pengajuan.models import PengajuanKP
from apps.pengajuan.services.pengajuan_validator import PengajuanValidator

class PengajuanMandiriFactory(PengajuanFactory):
    def create_pengajuan(self, data, mahasiswa_user):
        PengajuanValidator.validate_mandiri(data.get('judul_diajukan'), data.get('deskripsi_sistem'))
        return PengajuanKP.objects.create(
            mahasiswa=mahasiswa_user,
            topik=None,
            judul_diajukan=data.get('judul_diajukan'),
            deskripsi_sistem=data.get('deskripsi_sistem'),
            status_pengajuan='draft'
        )