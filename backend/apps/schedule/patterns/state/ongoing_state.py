from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.state.schedule_state import ScheduleState
from core.exceptions import InvalidStateTransitionError


class OngoingState(ScheduleState):
    name = ScheduleEvent.STATUS_ONGOING

    def handle_schedule(self, event):
        raise InvalidStateTransitionError('Jadwal sudah berlangsung')

    def handle_cancel(self, event):
        event.status = ScheduleEvent.STATUS_CANCELLED

    def handle_complete(self, event):
        event.status = ScheduleEvent.STATUS_COMPLETED

    def handle_reschedule(self, event, new_date, new_time):
        raise InvalidStateTransitionError('Jadwal yang sedang berlangsung tidak bisa dijadwalkan ulang')
