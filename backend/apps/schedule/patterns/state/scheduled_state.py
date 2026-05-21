from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.state.schedule_state import ScheduleState
from core.exceptions import InvalidStateTransitionError


class ScheduledState(ScheduleState):
    name = ScheduleEvent.STATUS_SCHEDULED

    def handle_schedule(self, event):
        event.status = ScheduleEvent.STATUS_ONGOING

    def handle_cancel(self, event):
        event.status = ScheduleEvent.STATUS_CANCELLED

    def handle_complete(self, event):
        raise InvalidStateTransitionError('Jadwal belum berlangsung, tidak bisa diselesaikan')

    def handle_reschedule(self, event, new_date, new_time):
        event.date = new_date
        event.time = new_time
        event.status = ScheduleEvent.STATUS_SCHEDULED
