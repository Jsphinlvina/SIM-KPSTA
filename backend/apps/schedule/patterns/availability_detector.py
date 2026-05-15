from datetime import date as _Date, datetime as _DateTime, time as _Time, timedelta

WORK_HOURS_START = _Time(9, 0)
WORK_HOURS_END = _Time(15, 0)
SLOT_DURATION_MINUTES = 60


def _add_minutes(t, minutes):
    return (_DateTime.combine(_Date.min, t) + timedelta(minutes=minutes)).time()


def _overlaps(start_a, end_a, start_b, end_b):
    return start_a < end_b and start_b < end_a


def _seed_dummy():
    return {
        1: [
            (_Date(2026, 5, 12), _Time(9, 0), _Time(10, 0)),
            (_Date(2026, 5, 12), _Time(13, 0), _Time(14, 0)),
            (_Date(2026, 5, 13), _Time(10, 0), _Time(11, 0)),
        ],
        2: [
            (_Date(2026, 5, 12), _Time(11, 0), _Time(12, 0)),
        ],
    }


class ScheduleAvailabilityDetector:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._cache = _seed_dummy()
        return cls._instance

    @classmethod
    def get_instance(cls):
        return cls()

    def reset_cache(self, data=None):
        self._cache = data if data is not None else _seed_dummy()

    def _bookings_on(self, lecturer_id, on_date):
        return [(s, e) for (d, s, e) in self._cache.get(lecturer_id, []) if d == on_date]

    def is_available(self, lecturer_id, on_date, at_time):
        if not (WORK_HOURS_START <= at_time < WORK_HOURS_END):
            return False
        end = _add_minutes(at_time, SLOT_DURATION_MINUTES)
        return not any(_overlaps(at_time, end, s, e) for s, e in self._bookings_on(lecturer_id, on_date))

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
