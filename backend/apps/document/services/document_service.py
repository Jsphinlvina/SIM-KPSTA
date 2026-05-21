from apps.document.models import Document
from apps.document.patterns.state import get_state
from apps.document.patterns.template_method.final_report_uploader import FinalReportUploader
from apps.document.patterns.template_method.proposal_uploader import ProposalUploader
from apps.notification import events
from apps.notification.services import notification_service


def upload_proposal(uploaded_file, metadata):
    return ProposalUploader().upload(uploaded_file, metadata)


def upload_final_report(uploaded_file, metadata):
    return FinalReportUploader().upload(uploaded_file, metadata)


def list_documents():
    return Document.objects.all()


def get_document(document_id):
    return Document.objects.filter(id=document_id).first()


def list_by_bimbingan(bimbingan_aktif_id):
    return Document.objects.filter(bimbingan_aktif_id=bimbingan_aktif_id)


def verify_document(document):
    get_state(document.status).handle_verify(document)
    document.save()
    notification_service.notify(events.DOCUMENT_VERIFIED, {
        'user_id': document.uploaded_by,
        'message': f'Dokumen {document.file_name} telah diverifikasi',
        'type': 'dokumen',
    })
    return document


def reject_document(document, reason):
    get_state(document.status).handle_reject(document, reason)
    document.save()
    notification_service.notify(events.DOCUMENT_REJECTED, {
        'user_id': document.uploaded_by,
        'message': f'Dokumen {document.file_name} ditolak: {reason}',
        'type': 'dokumen',
    })
    return document


def revise_document(document):
    get_state(document.status).handle_revise(document)
    document.save()
    return document
