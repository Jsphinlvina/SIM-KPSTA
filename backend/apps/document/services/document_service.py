from apps.document.models import Document
from apps.document.patterns.state import get_state
from apps.document.patterns.template_method.final_report_uploader import FinalReportUploader
from apps.document.patterns.template_method.proposal_uploader import ProposalUploader
from apps.notification import events
from apps.notification.services import notification_service


def _notify_uploader(document, event_name, message):
    notification_service.notify(event_name, {
        'user_id': document.uploaded_by,
        'message': message,
        'type': 'dokumen',
    })


def upload_proposal(data, uploaded_file):
    return ProposalUploader().upload(data, uploaded_file)


def upload_final_report(data, uploaded_file):
    return FinalReportUploader().upload(data, uploaded_file)


def list_documents():
    return Document.objects.all()


def get_document(document_id):
    return Document.objects.filter(id=document_id).first()


def list_by_bimbingan(bimbingan_aktif_id):
    return Document.objects.filter(bimbingan_aktif_id=bimbingan_aktif_id)


def verify(document):
    get_state(document.status).verify(document)
    document.rejection_reason = ''
    document.save()
    _notify_uploader(
        document, events.DOCUMENT_VERIFIED,
        f'Dokumen {document.get_document_type_display()} telah diverifikasi.',
    )
    return document


def reject(document, note=''):
    get_state(document.status).reject(document)
    document.rejection_reason = note
    document.save()
    _notify_uploader(
        document, events.DOCUMENT_REJECTED,
        f'Dokumen {document.get_document_type_display()} ditolak. {note}'.strip(),
    )
    return document


def revise(document):
    get_state(document.status).revise(document)
    document.save()
    return document
