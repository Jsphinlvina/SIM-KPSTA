from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.availability_detector import ScheduleAvailabilityDetector
from apps.schedule.patterns.state import get_state
from core.exceptions import ScheduleConflictError


class GuidanceScheduleManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    @classmethod
    def get_instance(cls):
        return cls()

    def create_schedule(self, data):
        detector = ScheduleAvailabilityDetector.get_instance()
        if not detector.is_available(data['lecturer_id'], data['date'], data['time']):
            raise ScheduleConflictError('Dosen tidak tersedia pada tanggal dan waktu tersebut')

        event = ScheduleEvent.objects.create(
            bimbingan_aktif_id=data['bimbingan_aktif_id'],
            lecturer_id=data['lecturer_id'],
            event_type=ScheduleEvent.EVENT_GUIDANCE,
            date=data['date'],
            time=data['time'],
            location=data.get('location', ''),
            notes=data.get('notes', ''),
            status=ScheduleEvent.STATUS_SCHEDULED,
        )
        detector.invalidate(event.lecturer_id, event.date)
        return event

    def start_schedule(self, event):
        get_state(event.status).start(event)
        event.save()
        return event

    def complete_schedule(self, event):
        get_state(event.status).complete(event)
        event.save()
        return event

    def cancel_schedule(self, event):
        get_state(event.status).cancel(event)
        event.save()
        ScheduleAvailabilityDetector.get_instance().invalidate(event.lecturer_id, event.date)
        return event

    def reschedule(self, event, new_date, new_time):
        get_state(event.status).reschedule(event)
        detector = ScheduleAvailabilityDetector.get_instance()
        if not detector.is_available(event.lecturer_id, new_date, new_time, exclude_event_id=event.id):
            raise ScheduleConflictError('Dosen tidak tersedia pada jadwal baru tersebut')

        old_date = event.date
        event.date = new_date
        event.time = new_time
        event.save()
        detector.invalidate(event.lecturer_id, old_date)
        detector.invalidate(event.lecturer_id, event.date)
        return event

    def update_details(self, event, data):
        for field in ('location', 'notes'):
            if field in data:
                setattr(event, field, data[field])
        event.save()
        return event
