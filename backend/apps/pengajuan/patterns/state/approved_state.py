from apps.pengajuan.patterns.state.pengajuan_state import PengajuanState
from rest_framework.exceptions import ValidationError

class ApprovedState(PengajuanState):
    def submit(self, context): raise ValidationError("Sudah disetujui koordinator, tidak bisa diubah.")
    def approve(self, context): raise ValidationError("Pengajuan ini sudah berstatus approved.")
    def reject(self, context): raise ValidationError("Pengajuan yang sudah approved tidak bisa direject.")
    def revise(self, context): raise ValidationError("Pengajuan yang sudah approved tidak bisa direvisi.")