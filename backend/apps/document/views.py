from rest_framework import status as http_status
from rest_framework.views import APIView

from core.exceptions import DomainError
from core.responses import created, fail, ok

from .serializers import DocumentRejectSerializer, DocumentSerializer, DocumentUploadSerializer
from .services import document_service


def _domain_fail(exc):
    return fail(exc.message, errors=exc.errors, status=http_status.HTTP_400_BAD_REQUEST)


class ProposalUploadView(APIView):
    def post(self, request):
        payload = DocumentUploadSerializer(data=request.data)
        if not payload.is_valid():
            return fail('Data tidak valid', errors=payload.errors)
        data = payload.validated_data
        try:
            document = document_service.upload_proposal(data['file'], {
                'bimbingan_aktif_id': data['bimbingan_aktif_id'],
                'uploaded_by': data['uploaded_by'],
            })
        except DomainError as exc:
            return _domain_fail(exc)
        return created(DocumentSerializer(document).data, message='Proposal berhasil diunggah')


class FinalReportUploadView(APIView):
    def post(self, request):
        payload = DocumentUploadSerializer(data=request.data)
        if not payload.is_valid():
            return fail('Data tidak valid', errors=payload.errors)
        data = payload.validated_data
        try:
            document = document_service.upload_final_report(data['file'], {
                'bimbingan_aktif_id': data['bimbingan_aktif_id'],
                'uploaded_by': data['uploaded_by'],
            })
        except DomainError as exc:
            return _domain_fail(exc)
        return created(DocumentSerializer(document).data, message='Laporan akhir berhasil diunggah')


class DocumentListView(APIView):
    def get(self, request):
        documents = document_service.list_documents()
        return ok(DocumentSerializer(documents, many=True).data)


class DocumentDetailView(APIView):
    def get(self, request, document_id):
        document = document_service.get_document(document_id)
        if document is None:
            return fail('Dokumen tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        return ok(DocumentSerializer(document).data)


class DocumentVerifyView(APIView):
    def post(self, request, document_id):
        document = document_service.get_document(document_id)
        if document is None:
            return fail('Dokumen tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        try:
            document = document_service.verify_document(document)
        except DomainError as exc:
            return _domain_fail(exc)
        return ok(DocumentSerializer(document).data, message='Dokumen diverifikasi')


class DocumentRejectView(APIView):
    def post(self, request, document_id):
        document = document_service.get_document(document_id)
        if document is None:
            return fail('Dokumen tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        payload = DocumentRejectSerializer(data=request.data)
        if not payload.is_valid():
            return fail('Data tidak valid', errors=payload.errors)
        try:
            document = document_service.reject_document(document, payload.validated_data['reason'])
        except DomainError as exc:
            return _domain_fail(exc)
        return ok(DocumentSerializer(document).data, message='Dokumen ditolak')


class DocumentReviseView(APIView):
    def post(self, request, document_id):
        document = document_service.get_document(document_id)
        if document is None:
            return fail('Dokumen tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        try:
            document = document_service.revise_document(document)
        except DomainError as exc:
            return _domain_fail(exc)
        return ok(DocumentSerializer(document).data, message='Dokumen dikembalikan ke draft untuk revisi')


class DocumentByBimbinganView(APIView):
    def get(self, request, bimbingan_aktif_id):
        documents = document_service.list_by_bimbingan(bimbingan_aktif_id)
        return ok(DocumentSerializer(documents, many=True).data)
