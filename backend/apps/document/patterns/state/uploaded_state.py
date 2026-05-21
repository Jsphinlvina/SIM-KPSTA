from apps.document.models import Document
from apps.document.patterns.state.document_state import DocumentState
from core.exceptions import InvalidStateTransitionError


class UploadedState(DocumentState):
    name = Document.STATUS_UPLOADED

    def handle_upload(self, document):
        raise InvalidStateTransitionError('Dokumen sudah terunggah')

    def handle_verify(self, document):
        document.status = Document.STATUS_VERIFIED
        document.rejection_reason = ''

    def handle_reject(self, document, reason):
        document.status = Document.STATUS_REJECTED
        document.rejection_reason = reason

    def handle_revise(self, document):
        raise InvalidStateTransitionError('Dokumen belum ditolak, tidak perlu revisi')
