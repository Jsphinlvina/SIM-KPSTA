from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.state.schedule_state import ScheduleState
from core.exceptions import InvalidStateTransitionError


class CompletedState(ScheduleState):
    name = ScheduleEvent.STATUS_COMPLETED

    def start(self, event):
        raise InvalidStateTransitionError('Jadwal sudah selesai')

    def complete(self, event):
        raise InvalidStateTransitionError('Jadwal sudah selesai')

    def cancel(self, event):
        raise InvalidStateTransitionError('Jadwal yang sudah selesai tidak bisa dibatalkan')

    def reschedule(self, event):
        raise InvalidStateTransitionError('Jadwal yang sudah selesai tidak bisa dijadwalkan ulang')
