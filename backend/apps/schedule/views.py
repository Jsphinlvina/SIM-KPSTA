from rest_framework.views import APIView

from core.responses import fail, ok

from .serializers import AvailabilityCheckQuerySerializer, AvailableSlotsQuerySerializer
from .services import availability_service


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
