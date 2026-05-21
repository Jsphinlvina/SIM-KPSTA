import os

from apps.document.models import Document
from apps.document.patterns.state import get_state
from apps.document.services import file_storage_service
from apps.notification import events
from apps.notification.services import notification_service
from core.exceptions import DomainError


class AbstractDocumentUploader:
    document_type = None
    allowed_extensions = ()
    max_size_mb = 0

    def upload(self, uploaded_file, metadata):
        self.validate_file(uploaded_file)
        stored = self.save_file(uploaded_file)
        document = self.save_to_db(stored, metadata)
        self.notify_verifier(document)
        return document

    def validate_file(self, uploaded_file):
        raise NotImplementedError

    def save_file(self, uploaded_file):
        return file_storage_service.save(uploaded_file)

    def save_to_db(self, stored, metadata):
        document = Document(
            bimbingan_aktif_id=metadata['bimbingan_aktif_id'],
            uploaded_by=metadata['uploaded_by'],
            document_type=self.document_type,
            file_name=stored['name'],
            file_url=stored['url'],
            status=Document.STATUS_DRAFT,
        )
        get_state(document.status).handle_upload(document)
        document.save()
        return document

    def notify_verifier(self, document):
        notification_service.notify(events.DOCUMENT_UPLOADED, {
            'user_id': document.uploaded_by,
            'message': f'Dokumen {document.file_name} berhasil diunggah dan menunggu verifikasi',
            'type': 'dokumen',
        })

    def _validate_extension(self, uploaded_file):
        extension = os.path.splitext(uploaded_file.name)[1].lower().lstrip('.')
        if extension not in self.allowed_extensions:
            allowed = ', '.join(self.allowed_extensions)
            raise DomainError(f'Format file tidak didukung, gunakan: {allowed}')

    def _validate_size(self, uploaded_file):
        if uploaded_file.size > self.max_size_mb * 1024 * 1024:
            raise DomainError(f'Ukuran file melebihi batas {self.max_size_mb} MB')
