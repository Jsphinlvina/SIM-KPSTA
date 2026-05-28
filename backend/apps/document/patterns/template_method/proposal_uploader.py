from apps.document.models import Document
from apps.document.patterns.template_method.abstract_document_uploader import AbstractDocumentUploader


class ProposalUploader(AbstractDocumentUploader):
    document_type = Document.TYPE_PROPOSAL
    allowed_extensions = ('pdf', 'doc', 'docx')
