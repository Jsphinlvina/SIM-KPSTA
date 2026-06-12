from apps.bimbingan.patterns.state.penentuan_state import PenentuanState

class MenungguState(PenentuanState):
    def handle_approve(self, context):
        if context.proses.tahap_chain == 'dosen':
            context.proses.tahap_chain = 'selesai'
            context.proses.status = 'disetujui'
        context.proses.save()

    def handle_reject(self, context, catatan):
        context.proses.status = 'ditolak'
        context.proses.catatan_penolakan = catatan
        context.proses.save()