from datetime import date as _Date, datetime as _DateTime, time as _Time, timedelta

WORK_HOURS_START = _Time(9, 0)
WORK_HOURS_END = _Time(15, 0)
SLOT_DURATION_MINUTES = 60


def _add_minutes(t, minutes):
    return (_DateTime.combine(_Date.min, t) + timedelta(minutes=minutes)).time()


def _overlaps(start_a, end_a, start_b, end_b):
    return start_a < end_b and start_b < end_a


class ScheduleAvailabilityDetector:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._cache = {}
        return cls._instance

    @classmethod
    def get_instance(cls):
        return cls()

    def invalidate(self, lecturer_id=None, on_date=None):
        if lecturer_id is None:
            self._cache = {}
        elif on_date is None:
            self._cache = {key: value for key, value in self._cache.items() if key[0] != lecturer_id}
        else:
            self._cache.pop((lecturer_id, on_date), None)

    def _query_bookings(self, lecturer_id, on_date, exclude_event_id=None):
        from apps.schedule.models import ScheduleEvent

        events = ScheduleEvent.objects.filter(
            lecturer_id=lecturer_id, date=on_date,
        ).exclude(status=ScheduleEvent.STATUS_CANCELLED)
        if exclude_event_id is not None:
            events = events.exclude(id=exclude_event_id)
        return [(event.time, _add_minutes(event.time, SLOT_DURATION_MINUTES)) for event in events]

    def _bookings_on(self, lecturer_id, on_date, exclude_event_id=None):
        if exclude_event_id is not None:
            return self._query_bookings(lecturer_id, on_date, exclude_event_id)
        key = (lecturer_id, on_date)
        if key not in self._cache:
            self._cache[key] = self._query_bookings(lecturer_id, on_date)
        return self._cache[key]

    def is_available(self, lecturer_id, on_date, at_time, exclude_event_id=None):
        if not (WORK_HOURS_START <= at_time < WORK_HOURS_END):
            return False
        end = _add_minutes(at_time, SLOT_DURATION_MINUTES)
        bookings = self._bookings_on(lecturer_id, on_date, exclude_event_id)
        return not any(_overlaps(at_time, end, s, e) for s, e in bookings)

    def open_slots(self, lecturer_id, on_date):
        bookings = self._bookings_on(lecturer_id, on_date)
        slots = []
        cursor = WORK_HOURS_START
        while cursor < WORK_HOURS_END:
            cursor_end = _add_minutes(cursor, SLOT_DURATION_MINUTES)
            if cursor_end > WORK_HOURS_END:
                break
            if not any(_overlaps(cursor, cursor_end, s, e) for s, e in bookings):
                slots.append({'start': cursor.strftime('%H:%M'), 'end': cursor_end.strftime('%H:%M')})
            cursor = cursor_end
        return slots

    def conflicts(self, lecturer_id, on_date):
        return [
            {'start': s.strftime('%H:%M'), 'end': e.strftime('%H:%M')}
            for s, e in sorted(self._bookings_on(lecturer_id, on_date))
        ]
