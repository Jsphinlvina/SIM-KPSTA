from apps.pengajuan.models import PengajuanKP
from apps.pengajuan.patterns.factory.pengajuan_topik_dosen_factory import PengajuanTopikDosenFactory
from apps.pengajuan.patterns.factory.pengajuan_mandiri_factory import PengajuanMandiriFactory

from apps.pengajuan.patterns.state.draft_state import DraftState
from apps.pengajuan.patterns.state.submitted_state import SubmittedState
from apps.pengajuan.patterns.state.approved_state import ApprovedState
from apps.pengajuan.patterns.state.rejected_state import RejectedState


class PengajuanService:

    def __init__(self, instance=None):
        self.instance = instance
        self.state = None
        if instance:
            self._load_state()

    def _load_state(self):
        status = self.instance.status_pengajuan
        if status == 'draft':
            self.state = DraftState()
        elif status == 'submitted':
            self.state = SubmittedState()
        elif status == 'approved':
            self.state = ApprovedState()
        elif status == 'rejected':
            self.state = RejectedState()

    @staticmethod
    def create_pengajuan(data, user):
        tipe = data.get('tipe', 'mandiri')
        return PengajuanService.create_via_factory(tipe, data, user)

    @staticmethod
    def create_via_factory(tipe, data, user):
        if tipe == 'topik-dosen':
            factory = PengajuanTopikDosenFactory()
        else:
            factory = PengajuanMandiriFactory()
        return factory.create_pengajuan(data, user)

    @staticmethod
    def get_riwayat_mahasiswa(mahasiswa_id):
        return PengajuanKP.objects.filter(mahasiswa_id=mahasiswa_id).select_related('mahasiswa', 'topik')

    @staticmethod
    def get_all_pengajuan():
        return PengajuanKP.objects.all().select_related('mahasiswa', 'topik')

    @staticmethod
    def get_pengajuan_by_id(pengajuan_id):
        try:
            return PengajuanKP.objects.select_related('mahasiswa', 'topik').get(pk=pengajuan_id)
        except PengajuanKP.DoesNotExist:
            return None

    # State transitions — operate on an instance
    def trigger_submit(self):
        self.state.submit(self)

    def trigger_approve(self):
        self.state.approve(self)

    def trigger_reject(self, catatan):
        self.instance.catatan = catatan
        self.state.reject(self)

    def trigger_revise(self, catatan):
        self.instance.catatan = catatan
        self.state.revise(self)
