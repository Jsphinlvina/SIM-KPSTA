from rest_framework import status as http_status
from rest_framework.views import APIView

from core.exceptions import DomainError, ScheduleConflictError
from core.responses import created, fail, ok

from .serializers import (
    AvailabilityCheckQuerySerializer,
    AvailableSlotsQuerySerializer,
    GuidanceCreateSerializer,
    GuidanceUpdateSerializer,
    RescheduleSerializer,
    ScheduleEventSerializer,
)
from .services import availability_service, guidance_service


def _domain_fail(exc):
    status = http_status.HTTP_409_CONFLICT if isinstance(exc, ScheduleConflictError) else http_status.HTTP_400_BAD_REQUEST
    return fail(exc.message, errors=exc.errors, status=status)


class CheckAvailabilityView(APIView):
    def get(self, request):
        params = AvailabilityCheckQuerySerializer(data=request.query_params)
        if not params.is_valid():
            return fail('Parameter tidak valid', errors=params.errors)
        if 'time' not in params.validated_data:
            return fail('Parameter time wajib diisi')

        data = availability_service.check_availability(
            params.validated_data['lecturer_id'],
            params.validated_data['date'],
            params.validated_data['time'],
        )
        return ok(data)


class OpenSlotsView(APIView):
    def get(self, request):
        params = AvailableSlotsQuerySerializer(data=request.query_params)
        if not params.is_valid():
            return fail('Parameter tidak valid', errors=params.errors)
        data = availability_service.open_slots(
            params.validated_data['lecturer_id'],
            params.validated_data['date'],
        )
        return ok(data)


class ConflictsView(APIView):
    def get(self, request):
        params = AvailableSlotsQuerySerializer(data=request.query_params)
        if not params.is_valid():
            return fail('Parameter tidak valid', errors=params.errors)
        data = availability_service.conflicts(
            params.validated_data['lecturer_id'],
            params.validated_data['date'],
        )
        return ok(data)


class GuidanceListCreateView(APIView):
    def get(self, request):
        schedules = guidance_service.list_schedules()
        return ok(ScheduleEventSerializer(schedules, many=True).data)

    def post(self, request):
        payload = GuidanceCreateSerializer(data=request.data)
        if not payload.is_valid():
            return fail('Data tidak valid', errors=payload.errors)
        try:
            event = guidance_service.create_schedule(payload.validated_data)
        except DomainError as exc:
            return _domain_fail(exc)
        return created(ScheduleEventSerializer(event).data, message='Jadwal bimbingan dibuat')


class GuidanceDetailView(APIView):
    def get(self, request, schedule_id):
        event = guidance_service.get_schedule(schedule_id)
        if event is None:
            return fail('Jadwal tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        return ok(ScheduleEventSerializer(event).data)

    def put(self, request, schedule_id):
        event = guidance_service.get_schedule(schedule_id)
        if event is None:
            return fail('Jadwal tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        payload = GuidanceUpdateSerializer(data=request.data)
        if not payload.is_valid():
            return fail('Data tidak valid', errors=payload.errors)
        event = guidance_service.update_schedule(event, payload.validated_data)
        return ok(ScheduleEventSerializer(event).data, message='Jadwal bimbingan diperbarui')

    def delete(self, request, schedule_id):
        event = guidance_service.get_schedule(schedule_id)
        if event is None:
            return fail('Jadwal tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        guidance_service.delete_schedule(event)
        return ok(message='Jadwal bimbingan dihapus')


class GuidanceStartView(APIView):
    def post(self, request, schedule_id):
        event = guidance_service.get_schedule(schedule_id)
        if event is None:
            return fail('Jadwal tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        try:
            event = guidance_service.start_schedule(event)
        except DomainError as exc:
            return _domain_fail(exc)
        return ok(ScheduleEventSerializer(event).data, message='Jadwal bimbingan dimulai')


class GuidanceCompleteView(APIView):
    def post(self, request, schedule_id):
        event = guidance_service.get_schedule(schedule_id)
        if event is None:
            return fail('Jadwal tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        try:
            event = guidance_service.complete_schedule(event)
        except DomainError as exc:
            return _domain_fail(exc)
        return ok(ScheduleEventSerializer(event).data, message='Jadwal bimbingan diselesaikan')


class GuidanceCancelView(APIView):
    def post(self, request, schedule_id):
        event = guidance_service.get_schedule(schedule_id)
        if event is None:
            return fail('Jadwal tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        try:
            event = guidance_service.cancel_schedule(event)
        except DomainError as exc:
            return _domain_fail(exc)
        return ok(ScheduleEventSerializer(event).data, message='Jadwal bimbingan dibatalkan')


class GuidanceRescheduleView(APIView):
    def post(self, request, schedule_id):
        event = guidance_service.get_schedule(schedule_id)
        if event is None:
            return fail('Jadwal tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        payload = RescheduleSerializer(data=request.data)
        if not payload.is_valid():
            return fail('Data tidak valid', errors=payload.errors)
        try:
            event = guidance_service.reschedule(
                event, payload.validated_data['date'], payload.validated_data['time'],
            )
        except DomainError as exc:
            return _domain_fail(exc)
        return ok(ScheduleEventSerializer(event).data, message='Jadwal bimbingan dijadwalkan ulang')


class GuidanceByBimbinganView(APIView):
    def get(self, request, bimbingan_aktif_id):
        schedules = guidance_service.list_by_bimbingan(bimbingan_aktif_id)
        return ok(ScheduleEventSerializer(schedules, many=True).data)
