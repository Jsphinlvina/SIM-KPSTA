from apps.archive.models import ArchiveRecord
from apps.archive.patterns.state.archive_state import ArchiveState
from core.exceptions import InvalidStateTransitionError


class ArchivedState(ArchiveState):
    name = ArchiveRecord.STATE_ARCHIVED

    def archive(self, record):
        raise InvalidStateTransitionError('Arsip sudah diarsipkan')

    def restore(self, record):
        record.state = ArchiveRecord.STATE_ACTIVE

    def delete(self, record):
        record.state = ArchiveRecord.STATE_DELETED
