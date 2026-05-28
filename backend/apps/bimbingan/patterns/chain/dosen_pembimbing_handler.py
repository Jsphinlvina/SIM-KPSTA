from apps.bimbingan.patterns.chain.approval_handler import ApprovalHandler

class DosenPembimbingHandler(ApprovalHandler):
    def handle(self, context, user):
        if context.proses.tahap_chain == 'dosen':
            if user.role != 'dosen' or user.user_id != context.proses.dosen_diusulkan.user_id:
                raise Exception("Akses Ditolak: Hanya Dosen Pembimbing yang diusulkan yang dapat merespons.")

            context.state.handle_approve(context)
            print("[SKELETON NOTIFIKASI] Konfirmasi kesediaan dosen berhasil. Menunggu approval final Ketua Prodi.")
            return True

        if self.next_handler:
            return self.next_handler.handle(context, user)
        return False