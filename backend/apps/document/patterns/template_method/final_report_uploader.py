from apps.document.models import Document
from apps.document.patterns.template_method.abstract_document_uploader import AbstractDocumentUploader


class FinalReportUploader(AbstractDocumentUploader):
    document_type = Document.TYPE_FINAL_REPORT
    allowed_extensions = ('pdf',)
    max_size_mb = 10

    def validate_file(self, uploaded_file):
        self._validate_extension(uploaded_file)
        self._validate_size(uploaded_file)
