from apps.notification.services import notification_service
from apps.schedule.patterns.observers.defense_observer import DefenseObserver, defense_event_phrase


class CoordinatorDefenseObserver(DefenseObserver):
    def __init__(self, coordinator_id):
        self.coordinator_id = coordinator_id

    def on_defense_event(self, event, defense):
        if not self.coordinator_id:
            return
        notification_service.notify(event, {
            'user_id': self.coordinator_id,
            'message': f'{defense_event_phrase(event, defense)} (terkait koordinasi sidang).',
            'type': 'sidang',
        })
