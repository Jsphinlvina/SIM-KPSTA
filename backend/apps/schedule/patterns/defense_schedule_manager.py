from apps.notification import events
from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.availability_detector import ScheduleAvailabilityDetector
from apps.schedule.patterns.observers.defense_subject import DefenseSubject
from core.exceptions import ScheduleConflictError


class DefenseScheduleManager(DefenseSubject):
    def __init__(self):
        self._observers = []

    def attach(self, observer):
        if observer not in self._observers:
            self._observers.append(observer)

    def detach(self, observer):
        if observer in self._observers:
            self._observers.remove(observer)

    def notify_observers(self, event, defense):
        for observer in list(self._observers):
            observer.on_defense_event(event, defense)

    def create_defense(self, data):
        detector = ScheduleAvailabilityDetector.get_instance()
        if not detector.is_available(data['lecturer_id'], data['date'], data['time']):
            raise ScheduleConflictError('Dosen penguji tidak tersedia pada tanggal dan waktu tersebut')

        defense = ScheduleEvent.objects.create(
            bimbingan_aktif_id=data['bimbingan_aktif_id'],
            lecturer_id=data['lecturer_id'],
            student_id=data.get('student_id'),
            coordinator_id=data.get('coordinator_id'),
            event_type=ScheduleEvent.EVENT_DEFENSE,
            date=data['date'],
            time=data['time'],
            location=data.get('location', ''),
            meeting_link=data.get('meeting_link', ''),
            notes=data.get('notes', ''),
            status=ScheduleEvent.STATUS_SCHEDULED,
        )
        detector.invalidate(defense.lecturer_id, defense.date)
        self.notify_observers(events.DEFENSE_SCHEDULE_CREATED, defense)
        return defense

    def update_defense(self, defense, data):
        new_date = data.get('date', defense.date)
        new_time = data.get('time', defense.time)
        detector = ScheduleAvailabilityDetector.get_instance()
        if ('date' in data or 'time' in data) and not detector.is_available(
            defense.lecturer_id, new_date, new_time, exclude_event_id=defense.id,
        ):
            raise ScheduleConflictError('Dosen penguji tidak tersedia pada jadwal baru tersebut')

        old_date = defense.date
        for field in ('date', 'time', 'location', 'meeting_link', 'notes'):
            if field in data:
                setattr(defense, field, data[field])
        defense.save()
        detector.invalidate(defense.lecturer_id, old_date)
        detector.invalidate(defense.lecturer_id, defense.date)
        self.notify_observers(events.DEFENSE_SCHEDULE_UPDATED, defense)
        return defense

    def cancel_defense(self, defense):
        defense.status = ScheduleEvent.STATUS_CANCELLED
        defense.save()
        ScheduleAvailabilityDetector.get_instance().invalidate(defense.lecturer_id, defense.date)
        self.notify_observers(events.DEFENSE_SCHEDULE_CANCELLED, defense)
        return defense
