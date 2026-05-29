from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.state.schedule_state import ScheduleState
from core.exceptions import InvalidStateTransitionError


class CancelledState(ScheduleState):
    name = ScheduleEvent.STATUS_CANCELLED

    def start(self, event):
        raise InvalidStateTransitionError('Jadwal sudah dibatalkan')

    def complete(self, event):
        raise InvalidStateTransitionError('Jadwal sudah dibatalkan')

    def cancel(self, event):
        raise InvalidStateTransitionError('Jadwal sudah dibatalkan')

    def reschedule(self, event):
        raise InvalidStateTransitionError('Jadwal yang sudah dibatalkan tidak bisa dijadwalkan ulang')
