from apps.document.models import Document
from apps.document.patterns.template_method.abstract_document_uploader import AbstractDocumentUploader


class ProposalUploader(AbstractDocumentUploader):
    document_type = Document.TYPE_PROPOSAL
    allowed_extensions = ('pdf', 'doc', 'docx')
    max_size_mb = 5

    def validate_file(self, uploaded_file):
        self._validate_extension(uploaded_file)
        self._validate_size(uploaded_file)
