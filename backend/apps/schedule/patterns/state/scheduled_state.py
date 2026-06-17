from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.state.schedule_state import ScheduleState
from core.exceptions import InvalidStateTransitionError


class ScheduledState(ScheduleState):
    name = ScheduleEvent.STATUS_SCHEDULED

    def start(self, event):
        event.status = ScheduleEvent.STATUS_ONGOING

    def complete(self, event):
        raise InvalidStateTransitionError('Jadwal belum dimulai, tidak bisa langsung diselesaikan')

    def cancel(self, event):
        event.status = ScheduleEvent.STATUS_CANCELLED

    def reschedule(self, event):
        pass
