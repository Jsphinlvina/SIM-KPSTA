from apps.document.models import Document
from apps.document.patterns.state.document_state import DocumentState
from core.exceptions import InvalidStateTransitionError


class VerifiedState(DocumentState):
    name = Document.STATUS_VERIFIED

    def submit(self, document):
        raise InvalidStateTransitionError('Dokumen sudah terverifikasi')

    def verify(self, document):
        raise InvalidStateTransitionError('Dokumen sudah terverifikasi')

    def reject(self, document):
        raise InvalidStateTransitionError('Dokumen sudah terverifikasi, tidak bisa ditolak')

    def revise(self, document):
        raise InvalidStateTransitionError('Dokumen sudah terverifikasi')
