from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from core.responses import ok, fail 
from core.permissions import IsMahasiswa  

from apps.pengajuan.models import PengajuanKP
from apps.pengajuan.serializers import PengajuanKPSerializer
from apps.pengajuan.services.pengajuan_service import PengajuanService


class PengajuanKPViewSet(viewsets.ModelViewSet):
    queryset = PengajuanKP.objects.all()
    serializer_class = PengajuanKPSerializer

    def get_permissions(self):
        if self.action in ['create', 'riwayat_saya']:
            return [IsAuthenticated(), IsMahasiswa()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        try:
            pengajuan = PengajuanService.create_pengajuan(request.data, request.user)
            serializer = self.get_serializer(pengajuan)
            return ok(data=serializer.data, message="Judul KP/STA Anda berhasil diajukan! Menunggu persetujuan pembimbing.", status=status.HTTP_201_CREATED)
        except Exception as e:
            error_msg = e.detail if hasattr(e, 'detail') else str(e)
            return fail(message=error_msg, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='riwayat')
    def riwayat_saya(self, request):
        riwayat = PengajuanService.get_riwayat_mahasiswa(request.user.user_id)
        serializer = self.get_serializer(riwayat, many=True)
        return ok(data=serializer.data, message="Berhasil memuat seluruh riwayat pengajuan judul Anda.")