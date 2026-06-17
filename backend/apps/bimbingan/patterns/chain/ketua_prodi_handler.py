from apps.bimbingan.patterns.chain.approval_handler import ApprovalHandler
from apps.bimbingan.models import BimbinganAktif

class KetuaProdiHandler(ApprovalHandler):
    def handle(self, context, user):
        if context.proses.tahap_chain == 'kaprodi':
            if user.role != 'kaprodi':
                raise Exception("Akses Ditolak: Hanya Ketua Program Studi yang berhak memberikan approval final.")

            context.state.handle_approve(context)

            BimbinganAktif.objects.create(
                pengajuan=context.proses.pengajuan,
                mahasiswa=context.proses.pengajuan.mahasiswa,
                dosen=context.proses.dosen_diusulkan
            )
            print(f"[SKELETON NOTIFIKASI] Approval final Kaprodi Sukses! BimbinganAktif ID resmi tercipta.")
            return True

        if self.next_handler:
            return self.next_handler.handle(context, user)
        return False