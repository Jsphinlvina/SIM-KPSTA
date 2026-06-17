from apps.pengajuan.patterns.state.pengajuan_state import PengajuanState
from rest_framework.exceptions import ValidationError

class DraftState(PengajuanState):
    def submit(self, context):
        context.instance.status_pengajuan = 'submitted'
        context.instance.save()
        print(f"[SKELETON NOTIFIKASI] Pengajuan ID {context.instance.pengajuan_kp_id} disiarkan ke Koordinator.")

    def approve(self, context): raise ValidationError("Draft belum bisa diapprove, silakan submit terlebih dahulu.")
    def reject(self, context): raise ValidationError("Draft tidak bisa langsung direject.")
    def revise(self, context): raise ValidationError("Draft belum dikirim untuk direvisi.")