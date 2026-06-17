from apps.laporan.patterns.template_method.abstract_laporan_generator import AbstractLaporanGenerator
from apps.laporan.models.report import Report


class LaporanDistribusiDosen(AbstractLaporanGenerator):

    def collect_data(self, periode_id) -> dict:
        from apps.bimbingan.models import BimbinganAktif
        qs = BimbinganAktif.objects.select_related(
            'dosen', 'mahasiswa', 'pengajuan__topik', 'pengajuan__topik__periode'
        )
        if periode_id:
            qs = qs.filter(pengajuan__topik__periode_id=periode_id)
        return {'records': list(qs)}

    def process_data(self, raw_data: dict) -> dict:
        distribusi = {}
        for record in raw_data['records']:
            dosen_id = record.dosen.user_id
            if dosen_id not in distribusi:
                distribusi[dosen_id] = {
                    'nama_dosen': record.dosen.nama_lengkap,
                    'nip': record.dosen.nim_nip,
                    'jumlah_mahasiswa': 0,
                    'mahasiswa': [],
                }
            distribusi[dosen_id]['jumlah_mahasiswa'] += 1
            distribusi[dosen_id]['mahasiswa'].append({
                'nama': record.mahasiswa.nama_lengkap,
                'nim': record.mahasiswa.nim_nip,
                'topik': (
                    record.pengajuan.topik.judul
                    if record.pengajuan.topik
                    else record.pengajuan.judul_diajukan
                ),
            })
        return {'distribusi': distribusi, 'total_dosen': len(distribusi)}

    def format_report(self, processed_data: dict, periode_id) -> Report:
        return Report(
            title='Laporan Distribusi Dosen Pembimbing',
            periode=str(periode_id) if periode_id else 'Semua Periode',
            data=processed_data,
            report_type='distribusi_dosen',
        )
