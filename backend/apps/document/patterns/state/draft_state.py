from apps.document.models import Document
from apps.document.patterns.state.document_state import DocumentState
from core.exceptions import InvalidStateTransitionError


class DraftState(DocumentState):
    name = Document.STATUS_DRAFT

    def handle_upload(self, document):
        document.status = Document.STATUS_UPLOADED

    def handle_verify(self, document):
        raise InvalidStateTransitionError('Dokumen masih draft, belum bisa diverifikasi')

    def handle_reject(self, document, reason):
        raise InvalidStateTransitionError('Dokumen masih draft, belum bisa ditolak')

    def handle_revise(self, document):
        raise InvalidStateTransitionError('Dokumen masih draft, tidak perlu revisi')
