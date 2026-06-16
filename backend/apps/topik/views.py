from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import ValidationError as DRFValidationError
from core.responses import ok, fail
from core.permissions import IsDosen, IsAdmin, IsDosenOrKoordinator


def _extract_error(e):
    if isinstance(e, DRFValidationError):
        detail = e.detail
        if isinstance(detail, list):
            return str(detail[0])
        if isinstance(detail, dict):
            return str(next(iter(detail.values()))[0])
        return str(detail)
    return str(e)

from apps.topik.models import PeriodeSemester, Topik
from apps.topik.serializers import PeriodeSemesterSerializer, TopikSerializer
from apps.topik.services.topik_service import TopikService
from apps.topik.services.periode_service import PeriodeService


class PeriodeSemesterViewSet(viewsets.ModelViewSet):
    queryset = PeriodeSemester.objects.all().order_by('-periode_semester_id')
    serializer_class = PeriodeSemesterSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'activate', 'deactivate']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        try:
            periode = PeriodeService.create_periode(request.data)
            serializer = self.get_serializer(periode)
            return ok(data=serializer.data, message="Periode semester baru berhasil dibuat.", status=status.HTTP_201_CREATED)
        except Exception as e:
            return fail(message=_extract_error(e), status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            periode = PeriodeService.update_periode(kwargs['pk'], request.data)
            if not periode:
                return fail(message="Periode tidak ditemukan.", status=status.HTTP_404_NOT_FOUND)
            return ok(data=self.get_serializer(periode).data, message="Periode berhasil diperbarui.")
        except Exception as e:
            return fail(message=_extract_error(e), status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        try:
            deleted = PeriodeService.delete_periode(kwargs['pk'])
            if not deleted:
                return fail(message="Periode tidak ditemukan.", status=status.HTTP_404_NOT_FOUND)
            return ok(message="Periode berhasil dihapus.")
        except Exception as e:
            return fail(message=_extract_error(e), status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='active')
    def get_active(self, request):
        periode = PeriodeService.get_active_periode()
        if not periode:
            return fail(message="Belum ada periode akademik yang aktif.", status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(periode)
        return ok(data=serializer.data, message="Berhasil mengambil periode aktif.")

    @action(detail=True, methods=['post'], url_path='activate')
    def activate(self, request, pk=None):
        try:
            periode = PeriodeService.activate_periode(pk)
            if not periode:
                return fail(message="Periode tidak ditemukan.", status=status.HTTP_404_NOT_FOUND)
            return ok(data=self.get_serializer(periode).data, message="Periode berhasil diaktifkan.")
        except Exception as e:
            return fail(message=_extract_error(e), status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='deactivate')
    def deactivate(self, request, pk=None):
        periode = PeriodeService.deactivate_periode(pk)
        if not periode:
            return fail(message="Periode tidak ditemukan.", status=status.HTTP_404_NOT_FOUND)
        return ok(data=self.get_serializer(periode).data, message="Periode berhasil dinonaktifkan.")


class TopikViewSet(viewsets.ModelViewSet):
    queryset = Topik.objects.all()
    serializer_class = TopikSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'by_dosen']:
            return [IsAuthenticated(), IsDosenOrKoordinator()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        try:
            topik = TopikService.create_topik_penawaran(request.data, request.user)
            serializer = self.get_serializer(topik)
            return ok(data=serializer.data, message="Topik penawaran baru berhasil disiarkan.")
        except Exception as e:
            return fail(message=_extract_error(e))

    def update(self, request, *args, **kwargs):
        try:
            topik = self.get_object()
            serializer = self.get_serializer(topik, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            if 'user' not in data:
                data['user'] = topik.user
            topik.__dict__.update({k: v for k, v in data.items() if k != 'user'})
            topik.user = data['user']
            topik.save()
            return ok(data=self.get_serializer(topik).data, message="Topik berhasil diperbarui.")
        except Exception as e:
            return fail(message=_extract_error(e))

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        try:
            topik = self.get_object()
            topik.delete()
            return ok(message="Topik berhasil dihapus.")
        except Exception as e:
            return fail(message=_extract_error(e))

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