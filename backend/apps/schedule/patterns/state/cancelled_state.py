from apps.schedule.models import ScheduleEvent
from apps.schedule.patterns.state.schedule_state import ScheduleState
from core.exceptions import InvalidStateTransitionError


class CancelledState(ScheduleState):
    name = ScheduleEvent.STATUS_CANCELLED

    def handle_schedule(self, event):
        raise InvalidStateTransitionError('Jadwal sudah dibatalkan')

    def handle_cancel(self, event):
        raise InvalidStateTransitionError('Jadwal sudah dibatalkan')

    def handle_complete(self, event):
        raise InvalidStateTransitionError('Jadwal sudah dibatalkan')

    def handle_reschedule(self, event, new_date, new_time):
        raise InvalidStateTransitionError('Jadwal sudah dibatalkan, tidak bisa dijadwalkan ulang')
