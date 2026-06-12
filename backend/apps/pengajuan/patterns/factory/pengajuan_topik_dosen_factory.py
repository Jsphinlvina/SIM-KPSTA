from apps.pengajuan.patterns.factory.pengajuan_factory import PengajuanFactory
from apps.pengajuan.models import PengajuanKP
from apps.pengajuan.services.pengajuan_validator import PengajuanValidator

class PengajuanTopikDosenFactory(PengajuanFactory):
    def create_pengajuan(self, data, mahasiswa_user):
        from apps.bimbingan.models import ProsesPenentuan
        topik = PengajuanValidator.validate_topik_dosen(data.get('topik'))
        dosen = topik.user
        pengajuan = PengajuanKP.objects.create(
            mahasiswa=mahasiswa_user,
            topik=topik,
            periode=topik.periode,
            judul_diajukan=topik.judul,
            deskripsi_sistem=data.get('deskripsi_sistem', f"Mengambil topik dari: {topik.judul}"),
            status_pengajuan='submitted',
        )
        ProsesPenentuan.objects.create(
            pengajuan=pengajuan,
            dosen_diusulkan=dosen,
            status='menunggu',
            tahap_chain='dosen',
        )
        return pengajuan