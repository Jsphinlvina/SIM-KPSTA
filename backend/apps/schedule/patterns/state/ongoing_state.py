from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.state.schedule_state import ScheduleState
from core.exceptions import InvalidStateTransitionError


class OngoingState(ScheduleState):
    name = ScheduleEvent.STATUS_ONGOING

    def start(self, event):
        raise InvalidStateTransitionError('Jadwal sudah berlangsung')

    def complete(self, event):
        event.status = ScheduleEvent.STATUS_COMPLETED

    def cancel(self, event):
        event.status = ScheduleEvent.STATUS_CANCELLED

    def reschedule(self, event):
        raise InvalidStateTransitionError('Jadwal yang sedang berlangsung tidak bisa dijadwalkan ulang')
