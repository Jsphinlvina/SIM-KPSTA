from apps.schedule.patterns.state.cancelled_state import CancelledState
from apps.schedule.patterns.state.completed_state import CompletedState
from apps.schedule.patterns.state.ongoing_state import OngoingState
from apps.schedule.patterns.state.schedule_state import ScheduleState
from apps.schedule.patterns.state.scheduled_state import ScheduledState
from core.exceptions import InvalidStateTransitionError

_STATES = {
    ScheduledState.name: ScheduledState,
    OngoingState.name: OngoingState,
    CompletedState.name: CompletedState,
    CancelledState.name: CancelledState,
}


def get_state(name):
    state_class = _STATES.get(name)
    if state_class is None:
        raise InvalidStateTransitionError(f'Status jadwal tidak dikenal: {name}')
    return state_class()


__all__ = [
    'ScheduleState',
    'ScheduledState',
    'OngoingState',
    'CompletedState',
    'CancelledState',
    'get_state',
]
