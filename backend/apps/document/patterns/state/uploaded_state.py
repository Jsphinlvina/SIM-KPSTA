from apps.document.models import Document
from apps.document.patterns.state.document_state import DocumentState
from core.exceptions import InvalidStateTransitionError


class UploadedState(DocumentState):
    name = Document.STATUS_UPLOADED

    def submit(self, document):
        raise InvalidStateTransitionError('Dokumen sudah diunggah')

    def verify(self, document):
        document.status = Document.STATUS_VERIFIED

    def reject(self, document):
        document.status = Document.STATUS_REJECTED

    def revise(self, document):
        raise InvalidStateTransitionError('Dokumen belum ditolak, tidak perlu direvisi')
