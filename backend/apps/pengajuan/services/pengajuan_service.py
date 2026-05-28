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
        if status == 'draft': self.state = DraftState()
        elif status == 'submitted': self.state = SubmittedState()
        elif status == 'approved': self.state = ApprovedState()
        elif status == 'rejected': self.state = RejectedState()

    @staticmethod
    def create_via_factory(tipe, data, user):
        if tipe == 'topik-dosen': factory = PengajuanTopikDosenFactory()
        else: factory = PengajuanMandiriFactory()
        return factory.create_pengajuan(data, user)

    # State Actions
    def trigger_submit(self): self.state.submit(self)
    def trigger_approve(self): self.state.approve(self)
    def trigger_reject(self, catatan):
        self.instance.catatan = catatan
        self.state.reject(self)
    def trigger_revise(self, catatan):
        self.instance.catatan = catatan
        self.state.revise(self)