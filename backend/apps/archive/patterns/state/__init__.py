from apps.archive.patterns.state.active_state import ActiveState
from apps.archive.patterns.state.archive_state import ArchiveState
from apps.archive.patterns.state.archived_state import ArchivedState
from apps.archive.patterns.state.deleted_state import DeletedState
from core.exceptions import InvalidStateTransitionError

_STATES = {
    ActiveState.name: ActiveState,
    ArchivedState.name: ArchivedState,
    DeletedState.name: DeletedState,
}


def get_state(name):
    state_class = _STATES.get(name)
    if state_class is None:
        raise InvalidStateTransitionError(f'Status arsip tidak dikenal: {name}')
    return state_class()


__all__ = [
    'ArchiveState',
    'ActiveState',
    'ArchivedState',
    'DeletedState',
    'get_state',
]
