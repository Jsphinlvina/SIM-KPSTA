from apps.bimbingan.models import ProsesPenentuan
from apps.bimbingan.patterns.state.menunggu_state import MenungguState
from apps.bimbingan.patterns.state.disetujui_state import DisetujuiState
from apps.bimbingan.patterns.state.ditolak_state import DitolakState
from apps.bimbingan.patterns.chain.koordinator_kp_handler import KoordinatorKPHandler
from apps.bimbingan.patterns.chain.dosen_pembimbing_handler import DosenPembimbingHandler
from apps.bimbingan.patterns.chain.ketua_prodi_handler import KetuaProdiHandler

class BimbinganService:
    def __init__(self, proses_penentuan_instance):
        self.proses = proses_penentuan_instance
        self.set_state_by_status()

    def set_state_by_status(self):
        if self.proses.status == 'menunggu':
            self.state = MenungguState()
        elif self.proses.status == 'disetujui':
            self.state = DisetujuiState()
        elif self.proses.status == 'ditolak':
            self.state = DitolakState()

    @classmethod
    def start_approval_chain(cls, pengajuan_instance, dosen_usulan):
        if pengajuan_instance.status_pengajuan != 'approved':
            raise Exception("Gagal: Proses pembimbing hanya bisa dimulai dari pengajuan KP yang berstatus APPROVED.")

        proses, created = ProsesPenentuan.objects.get_or_create(
            pengajuan=pengajuan_instance,
            defaults={'dosen_diusulkan': dosen_usulan, 'status': 'menunggu', 'tahap_chain': 'koordinator'}
        )
        if not created:
            raise Exception("Proses penentuan pembimbing untuk pengajuan ini sudah berjalan.")
        return cls(proses)

    def execute_approve_step(self, user):
        koordinator = KoordinatorKPHandler()
        dosen = DosenPembimbingHandler()
        kaprodi = KetuaProdiHandler()

        koordinator.set_next(dosen).set_next(kaprodi)

        success = koordinator.handle(self, user)
        if success:
            self.set_state_by_status()
        return self.proses

    def execute_reject_step(self, user, alasan):
        if self.proses.status != 'menunggu':
            raise Exception("Proses penentuan sudah ditutup, tidak bisa ditolak.")

        self.state.handle_reject(self, alasan)
        self.set_state_by_status()
        return self.proses