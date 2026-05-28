from apps.notification.services import notification_service
from apps.schedule.patterns.observers.defense_observer import DefenseObserver, defense_event_phrase


class StudentDefenseObserver(DefenseObserver):
    def __init__(self, student_id):
        self.student_id = student_id

    def on_defense_event(self, event, defense):
        if not self.student_id:
            return
        notification_service.notify(event, {
            'user_id': self.student_id,
            'message': f'{defense_event_phrase(event, defense)}.',
            'type': 'sidang',
        })
