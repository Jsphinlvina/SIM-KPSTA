from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from core.responses import ok, fail
from core.permissions import IsMahasiswa, IsKoordinator

from apps.pengajuan.models import PengajuanKP
from apps.pengajuan.serializers import PengajuanKPSerializer
from apps.pengajuan.services.pengajuan_service import PengajuanService


class PengajuanViewSet(viewsets.ModelViewSet):
    queryset = PengajuanKP.objects.all().select_related("mahasiswa", "topik")
    serializer_class = PengajuanKPSerializer
    authentication_classes = [JWTAuthentication]

    @action(detail=False, methods=["post"], url_path="topik-dosen")
    def ajukan_topik_dosen(self, request):
        try:
            pengajuan = PengajuanService.create_via_factory(
                "topik-dosen", request.data, request.user
            )
            return ok(
                data=self.get_serializer(pengajuan).data,
                message="Draft pengajuan topik dosen dibuat.",
            )
        except Exception as e:
            return fail(message=str(e))

    @action(detail=False, methods=["post"], url_path="mandiri")
    def ajukan_mandiri(self, request):
        try:
            pengajuan = PengajuanService.create_via_factory(
                "mandiri", request.data, request.user
            )
            return ok(
                data=self.get_serializer(pengajuan).data,
                message="Draft pengajuan mandiri dibuat.",
            )
        except Exception as e:
            return fail(message=str(e))

    @action(detail=False, methods=["get"], url_path="my")
    def my_pengajuan(self, request):
        records = self.queryset.filter(mahasiswa=request.user)
        return ok(data=self.get_serializer(records, many=True).data)

    @action(detail=True, methods=["post"], url_path="submit")
    def submit_draft(self, request, pk=None):
        service = PengajuanService(self.get_object())
        service.trigger_submit()
        return ok(message="Pengajuan berhasil di-submit ke Koordinator.")

    @action(detail=True, methods=["post"], url_path="submit")
    def submit_pengajuan(self, request, pk=None):
        try:
            pengajuan = self.get_object()
            service = PengajuanService(pengajuan)
            service.trigger_submit()

            return ok(message="Pengajuan berhasil dikirim ke dosen pembimbing!")
        except Exception as e:
            return fail(message=str(e))

    @action(detail=True, methods=["post"], url_path="approve")
    def approve_pengajuan(self, request, pk=None):
        service = PengajuanService(self.get_object())
        service.trigger_approve()
        return ok(message="Pengajuan disetujui.")

    @action(detail=True, methods=["post"], url_path="reject")
    def reject_pengajuan(self, request, pk=None):
        service = PengajuanService(self.get_object())
        service.trigger_reject(request.data.get("catatan", "Ditolak."))
        return ok(message="Pengajuan ditolak.")

    @action(detail=True, methods=["post"], url_path="revise")
    def revise_pengajuan(self, request, pk=None):
        service = PengajuanService(self.get_object())
        service.trigger_revise(request.data.get("catatan", "Butuh revisi."))
        return ok(message="Status dikembalikan ke draft revisi.")
