from apps.pengajuan.patterns.state.pengajuan_state import PengajuanState
from rest_framework.exceptions import ValidationError

class SubmittedState(PengajuanState):
    def submit(self, context): raise ValidationError("Pengajuan sudah berstatus submitted.")

    def approve(self, context):
        context.instance.status_pengajuan = 'approved'
        context.instance.save()
        if context.instance.topik:
            topik = context.instance.topik
            topik.kuota = max(0, topik.kuota - 1)
            topik.save()

    def reject(self, context):
        context.instance.status_pengajuan = 'rejected'
        context.instance.save()

    def revise(self, context):
        context.instance.status_pengajuan = 'draft'
        context.instance.save()