from apps.document.models import Document
from apps.document.patterns.template_method.abstract_document_uploader import AbstractDocumentUploader


class FinalReportUploader(AbstractDocumentUploader):
    document_type = Document.TYPE_FINAL_REPORT
    allowed_extensions = ('pdf', 'doc', 'docx', 'zip')
