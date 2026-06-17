from apps.archive.models import ArchiveRecord
from apps.archive.patterns.state.archive_state import ArchiveState
from core.exceptions import InvalidStateTransitionError


class DeletedState(ArchiveState):
    name = ArchiveRecord.STATE_DELETED

    def archive(self, record):
        raise InvalidStateTransitionError('Arsip sudah dihapus')

    def restore(self, record):
        raise InvalidStateTransitionError('Arsip sudah dihapus')

    def delete(self, record):
        raise InvalidStateTransitionError('Arsip sudah dihapus')
