from apps.document.models import Document
from apps.document.patterns.state.document_state import DocumentState
from core.exceptions import InvalidStateTransitionError


class DraftState(DocumentState):
    name = Document.STATUS_DRAFT

    def submit(self, document):
        document.status = Document.STATUS_UPLOADED

    def verify(self, document):
        raise InvalidStateTransitionError('Dokumen masih draft, belum diunggah')

    def reject(self, document):
        raise InvalidStateTransitionError('Dokumen masih draft, belum diunggah')

    def revise(self, document):
        raise InvalidStateTransitionError('Dokumen masih draft')
