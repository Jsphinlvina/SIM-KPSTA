import os
from abc import ABC, abstractmethod

from apps.document.models import Document
from apps.document.patterns.state import get_state
from apps.document.services import file_storage_service
from apps.notification import events
from apps.notification.services import notification_service
from core.exceptions import DomainError

MAX_SIZE_BYTES = 10 * 1024 * 1024


class AbstractDocumentUploader(ABC):
    @property
    @abstractmethod
    def document_type(self):
        ...

    @property
    @abstractmethod
    def allowed_extensions(self):
        ...

    def upload(self, data, uploaded_file):
        self.validate_file(uploaded_file)
        file_name, file_url = self.save_file(uploaded_file)
        document = self.save_to_db(data, file_name, file_url)
        self.notify_uploader(document)
        return document

    def validate_file(self, uploaded_file):
        if uploaded_file is None:
            raise DomainError('File wajib diunggah')
        extension = os.path.splitext(uploaded_file.name)[1].lower().lstrip('.')
        if extension not in self.allowed_extensions:
            raise DomainError(
                f'Ekstensi .{extension} tidak diizinkan',
                errors={'allowed': list(self.allowed_extensions)},
            )
        if uploaded_file.size > MAX_SIZE_BYTES:
            raise DomainError('Ukuran file melebihi batas 10 MB')

    def save_file(self, uploaded_file):
        return file_storage_service.save(uploaded_file)

    def save_to_db(self, data, file_name, file_url):
        document = Document.objects.create(
            bimbingan_aktif_id=data['bimbingan_aktif_id'],
            uploaded_by=data['uploaded_by'],
            document_type=self.document_type,
            file_name=file_name,
            file_url=file_url,
            status=Document.STATUS_DRAFT,
        )
        get_state(document.status).submit(document)
        document.save()
        return document

    def notify_uploader(self, document):
        notification_service.notify(events.DOCUMENT_UPLOADED, {
            'user_id': document.uploaded_by,
            'message': f'Dokumen {document.get_document_type_display()} berhasil diunggah dan menunggu verifikasi.',
            'type': 'dokumen',
        })
