from apps.pengajuan.patterns.factory.pengajuan_factory import PengajuanFactory
from apps.pengajuan.models import PengajuanKP
from apps.pengajuan.services.pengajuan_validator import PengajuanValidator
from apps.topik.models import PeriodeSemester

class PengajuanMandiriFactory(PengajuanFactory):
    def create_pengajuan(self, data, mahasiswa_user):
        PengajuanValidator.validate_mandiri(data.get('judul_diajukan'), data.get('deskripsi_sistem'))
        active_periode = PeriodeSemester.objects.filter(status_periode=True).first()
        return PengajuanKP.objects.create(
            mahasiswa=mahasiswa_user,
            topik=None,
            periode=active_periode,
            judul_diajukan=data.get('judul_diajukan'),
            deskripsi_sistem=data.get('deskripsi_sistem'),
            status_pengajuan='submitted',
        )