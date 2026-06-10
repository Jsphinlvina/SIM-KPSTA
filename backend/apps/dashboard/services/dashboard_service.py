from apps.bimbingan.models import BimbinganAktif
from apps.dashboard.patterns.dashboard_distribusi import DashboardDistribusi


class DashboardService:

    @staticmethod
    def _build_distribusi():
        records = BimbinganAktif.objects.select_related(
            'dosen', 'mahasiswa', 'pengajuan__topik'
        ).all()

        distribusi = {}
        for record in records:
            dosen_id = record.dosen.user_id
            if dosen_id not in distribusi:
                distribusi[dosen_id] = {
                    'nama_dosen': record.dosen.nama_lengkap,
                    'jumlah_mahasiswa': 0,
                    'mahasiswa': [],
                }
            distribusi[dosen_id]['jumlah_mahasiswa'] += 1
            distribusi[dosen_id]['mahasiswa'].append({
                'mahasiswa_id': record.mahasiswa.user_id,
                'nama': record.mahasiswa.nama_lengkap,
                'nim': record.mahasiswa.nim_nip,
                'topik': record.pengajuan.topik.judul if record.pengajuan.topik else record.pengajuan.judul_diajukan,
            })
        return distribusi

    @staticmethod
    def refresh_and_get():
        dashboard = DashboardDistribusi()
        distribusi = DashboardService._build_distribusi()
        dashboard.set_distribusi_data(distribusi)
        return distribusi

    @staticmethod
    def get_distribusi_by_dosen(dosen_id):
        distribusi = DashboardService.refresh_and_get()
        return distribusi.get(dosen_id)

    @staticmethod
    def get_summary():
        distribusi = DashboardService.refresh_and_get()
        total_dosen = len(distribusi)
        total_mahasiswa = sum(d['jumlah_mahasiswa'] for d in distribusi.values())
        avg = round(total_mahasiswa / total_dosen, 2) if total_dosen else 0
        return {
            'total_dosen_pembimbing': total_dosen,
            'total_mahasiswa_bimbingan': total_mahasiswa,
            'rata_rata_mahasiswa_per_dosen': avg,
        }

    @staticmethod
    def get_table_data():
        DashboardService.refresh_and_get()
        return DashboardDistribusi().get_table_data()

    @staticmethod
    def get_chart_data():
        DashboardService.refresh_and_get()
        return DashboardDistribusi().get_chart_data()
