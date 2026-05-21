from apps.document.models import Document
from apps.document.patterns.state.document_state import DocumentState
from core.exceptions import InvalidStateTransitionError


class RejectedState(DocumentState):
    name = Document.STATUS_REJECTED

    def handle_upload(self, document):
        raise InvalidStateTransitionError('Dokumen ditolak, ajukan revisi terlebih dahulu')

    def handle_verify(self, document):
        raise InvalidStateTransitionError('Dokumen ditolak, tidak bisa langsung diverifikasi')

    def handle_reject(self, document, reason):
        raise InvalidStateTransitionError('Dokumen sudah ditolak')

    def handle_revise(self, document):
        document.status = Document.STATUS_DRAFT
        document.rejection_reason = ''
