from apps.notification.services import notification_service
from apps.schedule.patterns.observers.defense_observer import DefenseObserver, defense_event_phrase


class LecturerDefenseObserver(DefenseObserver):
    def __init__(self, lecturer_id):
        self.lecturer_id = lecturer_id

    def on_defense_event(self, event, defense):
        if not self.lecturer_id:
            return
        notification_service.notify(event, {
            'user_id': self.lecturer_id,
            'message': f'{defense_event_phrase(event, defense)} (Anda terdaftar sebagai dosen penguji).',
            'type': 'sidang',
        })
