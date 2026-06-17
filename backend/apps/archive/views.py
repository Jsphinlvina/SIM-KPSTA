from rest_framework import status as http_status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.exceptions import DomainError
from core.responses import created, fail, ok

from .serializers import ArchiveRecordCreateSerializer, ArchiveRecordSerializer
from .services import archive_service, search_service


class _AuthView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


def _domain_fail(exc):
    return fail(exc.message, errors=exc.errors, status=http_status.HTTP_400_BAD_REQUEST)


class ArchiveListCreateView(_AuthView):
    def get(self, request):
        records = archive_service.list_records()
        return ok(ArchiveRecordSerializer(records, many=True).data)

    def post(self, request):
        payload = ArchiveRecordCreateSerializer(data=request.data)
        if not payload.is_valid():
            return fail('Data tidak valid', errors=payload.errors)
        record = archive_service.create_record(payload.validated_data)
        return created(ArchiveRecordSerializer(record).data, message='Arsip ditambahkan')


class ArchiveSearchView(_AuthView):
    def get(self, request):
        keyword = request.query_params.get('keyword', '')
        records = search_service.search(keyword)
        return ok(ArchiveRecordSerializer(records, many=True).data)


class ArchiveByStudentView(_AuthView):
    def get(self, request, student_id):
        records = archive_service.list_by_student(student_id)
        return ok(ArchiveRecordSerializer(records, many=True).data)


class ArchiveByLecturerView(_AuthView):
    def get(self, request, lecturer_id):
        records = archive_service.list_by_lecturer(lecturer_id)
        return ok(ArchiveRecordSerializer(records, many=True).data)


class ArchiveDetailView(_AuthView):
    def get(self, request, record_id):
        record = archive_service.get_record(record_id)
        if record is None:
            return fail('Arsip tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        return ok(ArchiveRecordSerializer(record).data)

    def delete(self, request, record_id):
        record = archive_service.get_record(record_id)
        if record is None:
            return fail('Arsip tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        try:
            record = archive_service.delete_record(record)
        except DomainError as exc:
            return _domain_fail(exc)
        return ok(ArchiveRecordSerializer(record).data, message='Arsip dihapus')


class ArchiveArchiveView(_AuthView):
    def post(self, request, record_id):
        record = archive_service.get_record(record_id)
        if record is None:
            return fail('Arsip tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        try:
            record = archive_service.archive_record(record)
        except DomainError as exc:
            return _domain_fail(exc)
        return ok(ArchiveRecordSerializer(record).data, message='Arsip diarsipkan')


class ArchiveRestoreView(_AuthView):
    def post(self, request, record_id):
        record = archive_service.get_record(record_id)
        if record is None:
            return fail('Arsip tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        try:
            record = archive_service.restore_record(record)
        except DomainError as exc:
            return _domain_fail(exc)
        return ok(ArchiveRecordSerializer(record).data, message='Arsip dipulihkan')
