from apps.bimbingan.patterns.chain.approval_handler import ApprovalHandler
from apps.bimbingan.models import BimbinganAktif

class DosenPembimbingHandler(ApprovalHandler):
    def handle(self, context, user):
        if context.proses.tahap_chain == 'dosen':
            if user.role != 'dosen' or user.user_id != context.proses.dosen_diusulkan.user_id:
                raise Exception("Akses Ditolak: Hanya Dosen Pembimbing yang diusulkan yang dapat merespons.")

            pengajuan = context.proses.pengajuan
            if pengajuan.topik and pengajuan.topik.kuota <= 0:
                raise Exception(f"Kuota topik '{pengajuan.topik.judul}' telah habis. Pengajuan tidak dapat disetujui.")

            context.state.handle_approve(context)

            pengajuan.status_pengajuan = 'approved'
            if pengajuan.topik:
                pengajuan.topik.kuota -= 1
                pengajuan.topik.save()
            pengajuan.save()

            BimbinganAktif.objects.create(
                pengajuan=pengajuan,
                mahasiswa=pengajuan.mahasiswa,
                dosen=context.proses.dosen_diusulkan,
            )
            return True

        if self.next_handler:
            return self.next_handler.handle(context, user)
        return False