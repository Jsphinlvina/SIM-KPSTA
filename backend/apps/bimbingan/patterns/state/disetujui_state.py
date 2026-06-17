from apps.bimbingan.patterns.state.penentuan_state import PenentuanState

class DisetujuiState(PenentuanState):
    def handle_approve(self, context):
        raise Exception("Proses penentuan bimbingan ini sudah disetujui secara final.")

    def handle_reject(self, context, catatan):
        raise Exception("Tidak dapat menolak proses yang sudah disetujui secara final.")