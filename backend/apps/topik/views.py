from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from core.responses import ok, fail
from core.permissions import IsDosen, IsAdmin

from apps.topik.models import PeriodeSemester, Topik
from apps.topik.serializers import PeriodeSemesterSerializer, TopikSerializer
from apps.topik.services.topik_service import TopikService
from apps.topik.services.periode_service import PeriodeService


class PeriodeSemesterViewSet(viewsets.ModelViewSet):
    queryset = PeriodeSemester.objects.all()
    serializer_class = PeriodeSemesterSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        try:
            periode = PeriodeService.create_periode(request.data)
            serializer = self.get_serializer(periode)
            return ok(data=serializer.data, message="Periode akademik baru berhasil dibuat.", status_code=status.HTTP_201_CREATED)
        except Exception as e:
            return fail(message=str(e), status_code=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='active')
    def get_active(self, request):
        periode = PeriodeService.get_active_periode()
        if not periode:
            return fail(message="Belum ada periode akademik yang aktif.", status_code=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(periode)
        return ok(data=serializer.data, message="Berhasil mengambil periode aktif.")


class TopikViewSet(viewsets.ModelViewSet):
    queryset = Topik.objects.all()
    serializer_class = TopikSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'by_dosen']:
            return [IsAuthenticated(), IsDosen()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        try:
            topik = TopikService.create_topik_penawaran(request.data, request.user)
            serializer = self.get_serializer(topik)
            return ok(data=serializer.data, message="Topik penawaran baru berhasil disiarkan.", status_code=status.HTTP_201_CREATED)
        except Exception as e:
            error_msg = e.detail if hasattr(e, 'detail') else str(e)
            return fail(message=error_msg, status_code=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='available')
    def available_topik(self, request):
        try:
            available_records = self.queryset.filter(kuota__gt=0)
            serializer = self.get_serializer(available_records, many=True)
            return ok(data=serializer.data, message="Berhasil memuat daftar topik dosen aktif.")
        except Exception as e:
            return fail(message=str(e))

    @action(detail=False, methods=['get'], url_path='by-dosen/(?P<dosen_id>[^/.]+)')
    def by_dosen(self, request, dosen_id=None):
        topik_list = TopikService.get_topik_by_dosen(dosen_id)
        serializer = self.get_serializer(topik_list, many=True)
        return ok(data=serializer.data, message=f"Berhasil mengambil rincian topik milik dosen ID {dosen_id}.")