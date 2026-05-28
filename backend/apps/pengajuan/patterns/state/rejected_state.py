from apps.pengajuan.patterns.state.pengajuan_state import PengajuanState
from rest_framework.exceptions import ValidationError

class RejectedState(PengajuanState):
    def submit(self, context): raise ValidationError("Pengajuan ditolak secara permanen.")
    def approve(self, context): raise ValidationError("Pengajuan ditolak tidak bisa diapprove.")
    def reject(self, context): raise ValidationError("Pengajuan sudah berstatus rejected.")
    def revise(self, context): raise ValidationError("Pengajuan ditolak tidak bisa direvisi.")