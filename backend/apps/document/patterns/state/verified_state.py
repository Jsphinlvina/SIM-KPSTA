from apps.document.models import Document
from apps.document.patterns.state.document_state import DocumentState
from core.exceptions import InvalidStateTransitionError


class VerifiedState(DocumentState):
    name = Document.STATUS_VERIFIED

    def handle_upload(self, document):
        raise InvalidStateTransitionError('Dokumen sudah terverifikasi')

    def handle_verify(self, document):
        raise InvalidStateTransitionError('Dokumen sudah terverifikasi')

    def handle_reject(self, document, reason):
        raise InvalidStateTransitionError('Dokumen sudah terverifikasi, tidak bisa ditolak')

    def handle_revise(self, document):
        raise InvalidStateTransitionError('Dokumen sudah terverifikasi, tidak perlu revisi')
