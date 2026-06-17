from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from core.responses import ok, fail
from core.permissions import IsKoordinatorOrKaprodi

from apps.laporan.services.laporan_service import LaporanService
from apps.laporan.services.pdf_exporter import PdfExporter
from apps.laporan.services.excel_exporter import ExcelExporter
from apps.laporan.serializers import ReportSerializer


class LaporanViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsKoordinatorOrKaprodi]

    @action(detail=False, methods=['get'], url_path='distribusi-dosen')
    def distribusi_dosen(self, request):
        periode_id = request.query_params.get('periode_id')
        report = LaporanService.generate('distribusi_dosen', periode_id)
        return ok(data=ReportSerializer(report).data, message="Laporan distribusi dosen berhasil dibuat.")

    @action(detail=False, methods=['get'], url_path='statistik-pengajuan')
    def statistik_pengajuan(self, request):
        periode_id = request.query_params.get('periode_id')
        report = LaporanService.generate('statistik_pengajuan', periode_id)
        return ok(data=ReportSerializer(report).data, message="Laporan statistik pengajuan berhasil dibuat.")

    @action(detail=False, methods=['get'], url_path='jumlah-mahasiswa-kp')
    def jumlah_mahasiswa_kp(self, request):
        periode_id = request.query_params.get('periode_id')
        report = LaporanService.generate('statistik_pengajuan', periode_id)
        total = report.data.get('total_pengajuan', 0)
        return ok(
            data={'jumlah_mahasiswa_kp': total, 'periode_id': periode_id},
            message="Jumlah mahasiswa KP berhasil dihitung.",
        )

    @action(detail=False, methods=['post'], url_path='export-pdf')
    def export_pdf(self, request):
        report_type = request.data.get('report_type', 'distribusi_dosen')
        periode_id = request.data.get('periode_id')
        try:
            report = LaporanService.generate(report_type, periode_id)
            pdf_bytes = report.export_to_pdf(PdfExporter())
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{report_type}.pdf"'
            return response
        except Exception as e:
            return fail(message=str(e))

    @action(detail=False, methods=['post'], url_path='export-excel')
    def export_excel(self, request):
        report_type = request.data.get('report_type', 'distribusi_dosen')
        periode_id = request.data.get('periode_id')
        try:
            report = LaporanService.generate(report_type, periode_id)
            excel_bytes = report.export_to_excel(ExcelExporter())
            content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            response = HttpResponse(excel_bytes, content_type=content_type)
            response['Content-Disposition'] = f'attachment; filename="{report_type}.xlsx"'
            return response
        except Exception as e:
            return fail(message=str(e))

    @action(detail=False, methods=['get'], url_path='types')
    def list_types(self, request):
        return ok(data=LaporanService.list_types(), message="Daftar jenis laporan tersedia.")
