from apps.archive.models import ArchiveRecord
from apps.archive.patterns.state.archive_state import ArchiveState
from core.exceptions import InvalidStateTransitionError


class ActiveState(ArchiveState):
    name = ArchiveRecord.STATE_ACTIVE

    def archive(self, record):
        record.state = ArchiveRecord.STATE_ARCHIVED

    def restore(self, record):
        raise InvalidStateTransitionError('Arsip masih aktif, tidak perlu dipulihkan')

    def delete(self, record):
        record.state = ArchiveRecord.STATE_DELETED
