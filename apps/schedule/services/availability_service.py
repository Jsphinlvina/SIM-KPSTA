from apps.schedule.patterns.availability_detector import ScheduleAvailabilityDetector


def check_availability(lecturer_id, on_date, at_time):
    detector = ScheduleAvailabilityDetector.get_instance()
    return {
        'lecturer_id': lecturer_id,
        'date': on_date.isoformat(),
        'time': at_time.strftime('%H:%M'),
        'available': detector.is_available(lecturer_id, on_date, at_time),
    }


def open_slots(lecturer_id, on_date):
    detector = ScheduleAvailabilityDetector.get_instance()
    return {
        'lecturer_id': lecturer_id,
        'date': on_date.isoformat(),
        'slots': detector.open_slots(lecturer_id, on_date),
    }


def conflicts(lecturer_id, on_date):
    detector = ScheduleAvailabilityDetector.get_instance()
    return {
        'lecturer_id': lecturer_id,
        'date': on_date.isoformat(),
        'conflicts': detector.conflicts(lecturer_id, on_date),
    }
