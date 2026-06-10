from apps.laporan.patterns.template_method.abstract_laporan_generator import AbstractLaporanGenerator
from apps.laporan.models.report import Report


class LaporanStatistikPengajuan(AbstractLaporanGenerator):

    def collect_data(self, periode_id) -> dict:
        from apps.pengajuan.models import PengajuanKP
        from apps.topik.models import Topik
        qs = PengajuanKP.objects.select_related('mahasiswa', 'topik__periode')
        if periode_id:
            qs = qs.filter(topik__periode_id=periode_id)
        return {'records': list(qs)}

    def process_data(self, raw_data: dict) -> dict:
        stats = {'draft': 0, 'submitted': 0, 'approved': 0, 'rejected': 0}
        total = 0
        for record in raw_data['records']:
            status = record.status_pengajuan
            if status in stats:
                stats[status] += 1
            total += 1
        return {
            'total_pengajuan': total,
            'per_status': stats,
            'persentase_disetujui': round(
                (stats['approved'] / total * 100) if total else 0, 2
            ),
        }

    def format_report(self, processed_data: dict, periode_id) -> Report:
        return Report(
            title='Laporan Statistik Pengajuan KP',
            periode=str(periode_id) if periode_id else 'Semua Periode',
            data=processed_data,
            report_type='statistik_pengajuan',
        )
