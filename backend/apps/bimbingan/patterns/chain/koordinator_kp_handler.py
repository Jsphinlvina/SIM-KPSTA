from apps.bimbingan.patterns.chain.approval_handler import ApprovalHandler

class KoordinatorKPHandler(ApprovalHandler):
    def handle(self, context, user):
        if context.proses.tahap_chain == 'koordinator':
            if user.role != 'koordinator':
                raise Exception("Akses Ditolak: Hanya Koordinator KP yang berhak melakukan verifikasi kuota.")

            context.state.handle_approve(context)
            print("[SKELETON NOTIFIKASI] Validasi Koordinator lolos. Berkas diteruskan ke Dosen Pembimbing.")
            return True

        if self.next_handler:
            return self.next_handler.handle(context, user)
        return False