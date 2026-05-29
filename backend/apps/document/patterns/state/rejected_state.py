from apps.document.models import Document
from apps.document.patterns.state.document_state import DocumentState
from core.exceptions import InvalidStateTransitionError


class RejectedState(DocumentState):
    name = Document.STATUS_REJECTED

    def submit(self, document):
        raise InvalidStateTransitionError('Dokumen ditolak, ajukan revisi terlebih dahulu')

    def verify(self, document):
        raise InvalidStateTransitionError('Dokumen ditolak, tidak bisa langsung diverifikasi')

    def reject(self, document):
        raise InvalidStateTransitionError('Dokumen sudah ditolak')

    def revise(self, document):
        document.status = Document.STATUS_DRAFT
