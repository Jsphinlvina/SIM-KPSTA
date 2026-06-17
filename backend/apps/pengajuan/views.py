from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from core.responses import ok, fail
from core.permissions import IsMahasiswa, IsKoordinator

from apps.pengajuan.models import PengajuanKP
from apps.pengajuan.serializers import PengajuanKPSerializer
from apps.pengajuan.services.pengajuan_service import PengajuanService


class PengajuanKPViewSet(viewsets.ModelViewSet):
    queryset = PengajuanKP.objects.all().select_related('mahasiswa', 'topik')
    serializer_class = PengajuanKPSerializer

    def get_permissions(self):
        if self.action in ['create', 'submit_topik_dosen', 'submit_mandiri', 'riwayat_saya']:
            return [IsAuthenticated(), IsMahasiswa()]
        if self.action in ['approve', 'reject', 'revise']:
            return [IsAuthenticated(), IsKoordinator()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        try:
            pengajuan = PengajuanService.create_pengajuan(request.data, request.user)
            serializer = self.get_serializer(pengajuan)
            return ok(
                data=serializer.data,
                message="Pengajuan KP berhasil dibuat.",
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            error_msg = e.detail if hasattr(e, 'detail') else str(e)
            return fail(message=error_msg, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='topik-dosen')
    def submit_topik_dosen(self, request):
        try:
            pengajuan = PengajuanService.create_via_factory('topik-dosen', request.data, request.user)
            serializer = self.get_serializer(pengajuan)
            return ok(
                data=serializer.data,
                message="Pengajuan topik dosen berhasil dibuat.",
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            error_msg = e.detail if hasattr(e, 'detail') else str(e)
            return fail(message=error_msg, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='mandiri')
    def submit_mandiri(self, request):
        try:
            pengajuan = PengajuanService.create_via_factory('mandiri', request.data, request.user)
            serializer = self.get_serializer(pengajuan)
            return ok(
                data=serializer.data,
                message="Pengajuan topik mandiri berhasil dibuat.",
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            error_msg = e.detail if hasattr(e, 'detail') else str(e)
            return fail(message=error_msg, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='riwayat')
    def riwayat_saya(self, request):
        riwayat = PengajuanService.get_riwayat_mahasiswa(request.user.user_id)
        serializer = self.get_serializer(riwayat, many=True)
        return ok(data=serializer.data, message="Berhasil memuat seluruh riwayat pengajuan Anda.")

    @action(detail=False, methods=['get'], url_path='my')
    def my_pengajuan(self, request):
        riwayat = PengajuanService.get_riwayat_mahasiswa(request.user.user_id)
        serializer = self.get_serializer(riwayat, many=True)
        return ok(data=serializer.data, message="Berhasil memuat pengajuan milik Anda.")

    @action(detail=True, methods=['post'], url_path='submit')
    def submit(self, request, pk=None):
        try:
            pengajuan = PengajuanService.get_pengajuan_by_id(pk)
            if not pengajuan:
                return fail(message="Pengajuan tidak ditemukan.", status=status.HTTP_404_NOT_FOUND)
            service = PengajuanService(pengajuan)
            service.trigger_submit()
            return ok(
                data=self.get_serializer(pengajuan).data,
                message="Pengajuan berhasil disubmit. Menunggu review koordinator.",
            )
        except Exception as e:
            error_msg = e.detail if hasattr(e, 'detail') else str(e)
            return fail(message=error_msg, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        try:
            pengajuan = PengajuanService.get_pengajuan_by_id(pk)
            if not pengajuan:
                return fail(message="Pengajuan tidak ditemukan.", status=status.HTTP_404_NOT_FOUND)
            service = PengajuanService(pengajuan)
            service.trigger_approve()
            return ok(
                data=self.get_serializer(pengajuan).data,
                message="Pengajuan berhasil disetujui.",
            )
        except Exception as e:
            error_msg = e.detail if hasattr(e, 'detail') else str(e)
            return fail(message=error_msg, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        try:
            pengajuan = PengajuanService.get_pengajuan_by_id(pk)
            if not pengajuan:
                return fail(message="Pengajuan tidak ditemukan.", status=status.HTTP_404_NOT_FOUND)
            catatan = request.data.get('catatan', '')
            service = PengajuanService(pengajuan)
            service.trigger_reject(catatan)
            return ok(
                data=self.get_serializer(pengajuan).data,
                message="Pengajuan telah ditolak.",
            )
        except Exception as e:
            error_msg = e.detail if hasattr(e, 'detail') else str(e)
            return fail(message=error_msg, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='revise')
    def revise(self, request, pk=None):
        try:
            pengajuan = PengajuanService.get_pengajuan_by_id(pk)
            if not pengajuan:
                return fail(message="Pengajuan tidak ditemukan.", status=status.HTTP_404_NOT_FOUND)
            catatan = request.data.get('catatan', '')
            service = PengajuanService(pengajuan)
            service.trigger_revise(catatan)
            return ok(
                data=self.get_serializer(pengajuan).data,
                message="Pengajuan dikembalikan ke draft untuk revisi.",
            )
        except Exception as e:
            error_msg = e.detail if hasattr(e, 'detail') else str(e)
            return fail(message=error_msg, status=status.HTTP_400_BAD_REQUEST)
