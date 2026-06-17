from apps.document.patterns.state.document_state import DocumentState
from apps.document.patterns.state.draft_state import DraftState
from apps.document.patterns.state.rejected_state import RejectedState
from apps.document.patterns.state.uploaded_state import UploadedState
from apps.document.patterns.state.verified_state import VerifiedState
from core.exceptions import InvalidStateTransitionError

_STATES = {
    DraftState.name: DraftState,
    UploadedState.name: UploadedState,
    VerifiedState.name: VerifiedState,
    RejectedState.name: RejectedState,
}


def get_state(name):
    state_class = _STATES.get(name)
    if state_class is None:
        raise InvalidStateTransitionError(f'Status dokumen tidak dikenal: {name}')
    return state_class()


__all__ = [
    'DocumentState',
    'DraftState',
    'UploadedState',
    'VerifiedState',
    'RejectedState',
    'get_state',
]
