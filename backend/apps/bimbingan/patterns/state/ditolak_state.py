from apps.bimbingan.patterns.state.penentuan_state import PenentuanState

class DitolakState(PenentuanState):
    def handle_approve(self, context):
        raise Exception("Tidak dapat menyetujui proses yang sudah ditolak.")

    def handle_reject(self, context, catatan):
        raise Exception("Proses penentuan ini sudah berada dalam status ditolak.")