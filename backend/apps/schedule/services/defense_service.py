from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.defense_schedule_manager import DefenseScheduleManager
from apps.schedule.patterns.observers.coordinator_defense_observer import CoordinatorDefenseObserver
from apps.schedule.patterns.observers.lecturer_defense_observer import LecturerDefenseObserver
from apps.schedule.patterns.observers.student_defense_observer import StudentDefenseObserver


def _manager(student_id, coordinator_id, lecturer_id):
    manager = DefenseScheduleManager()
    manager.attach(StudentDefenseObserver(student_id))
    manager.attach(CoordinatorDefenseObserver(coordinator_id))
    manager.attach(LecturerDefenseObserver(lecturer_id))
    return manager


def create_defense(data):
    manager = _manager(data.get('student_id'), data.get('coordinator_id'), data['lecturer_id'])
    return manager.create_defense(data)


def list_defenses():
    return ScheduleEvent.objects.filter(event_type=ScheduleEvent.EVENT_DEFENSE)


def get_defense(defense_id):
    return ScheduleEvent.objects.filter(
        id=defense_id, event_type=ScheduleEvent.EVENT_DEFENSE,
    ).first()


def list_by_student(student_id):
    return ScheduleEvent.objects.filter(
        event_type=ScheduleEvent.EVENT_DEFENSE, student_id=student_id,
    )


def update_defense(defense, data):
    manager = _manager(defense.student_id, defense.coordinator_id, defense.lecturer_id)
    return manager.update_defense(defense, data)


def cancel_defense(defense):
    manager = _manager(defense.student_id, defense.coordinator_id, defense.lecturer_id)
    return manager.cancel_defense(defense)
