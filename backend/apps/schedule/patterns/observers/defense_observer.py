from abc import ABC, abstractmethod

from apps.notification import events


def defense_event_phrase(event, defense):
    when = f'{defense.date} {defense.time:%H:%M}'
    if event == events.DEFENSE_SCHEDULE_CREATED:
        return f'Jadwal sidang dibuat untuk {when}'
    if event == events.DEFENSE_SCHEDULE_CANCELLED:
        return f'Jadwal sidang pada {when} dibatalkan'
    return f'Jadwal sidang diperbarui menjadi {when}'


class DefenseObserver(ABC):
    @abstractmethod
    def on_defense_event(self, event, defense):
        ...
