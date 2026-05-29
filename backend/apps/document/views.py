from rest_framework import status as http_status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.exceptions import DomainError
from core.permissions import IsDosen, IsMahasiswa
from core.responses import created, fail, ok

from .serializers import DocumentSerializer, DocumentUploadSerializer, RejectSerializer
from .services import document_service


class _AuthView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class ProposalUploadView(_AuthView):
    permission_classes = [IsMahasiswa]

    def post(self, request):
        payload = DocumentUploadSerializer(data=request.data)
        if not payload.is_valid():
            return fail('Data tidak valid', errors=payload.errors)
        uploaded_file = payload.validated_data.pop('file')
        try:
            document = document_service.upload_proposal(payload.validated_data, uploaded_file)
        except DomainError as exc:
            return fail(exc.message, errors=exc.errors)
        return created(DocumentSerializer(document).data, message='Proposal diunggah')


class FinalReportUploadView(_AuthView):
    permission_classes = [IsMahasiswa]

    def post(self, request):
        payload = DocumentUploadSerializer(data=request.data)
        if not payload.is_valid():
            return fail('Data tidak valid', errors=payload.errors)
        uploaded_file = payload.validated_data.pop('file')
        try:
            document = document_service.upload_final_report(payload.validated_data, uploaded_file)
        except DomainError as exc:
            return fail(exc.message, errors=exc.errors)
        return created(DocumentSerializer(document).data, message='Laporan akhir diunggah')


class DocumentListView(_AuthView):
    def get(self, request):
        documents = document_service.list_documents()
        return ok(DocumentSerializer(documents, many=True).data)


class DocumentDetailView(_AuthView):
    def get(self, request, document_id):
        document = document_service.get_document(document_id)
        if document is None:
            return fail('Dokumen tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        return ok(DocumentSerializer(document).data)


class DocumentVerifyView(_AuthView):
    permission_classes = [IsDosen]

    def post(self, request, document_id):
        document = document_service.get_document(document_id)
        if document is None:
            return fail('Dokumen tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        try:
            document = document_service.verify(document)
        except DomainError as exc:
            return fail(exc.message, errors=exc.errors)
        return ok(DocumentSerializer(document).data, message='Dokumen diverifikasi')


class DocumentRejectView(_AuthView):
    permission_classes = [IsDosen]

    def post(self, request, document_id):
        document = document_service.get_document(document_id)
        if document is None:
            return fail('Dokumen tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        payload = RejectSerializer(data=request.data)
        if not payload.is_valid():
            return fail('Data tidak valid', errors=payload.errors)
        try:
            document = document_service.reject(document, payload.validated_data.get('note', ''))
        except DomainError as exc:
            return fail(exc.message, errors=exc.errors)
        return ok(DocumentSerializer(document).data, message='Dokumen ditolak')


class DocumentReviseView(_AuthView):
    permission_classes = [IsMahasiswa]

    def post(self, request, document_id):
        document = document_service.get_document(document_id)
        if document is None:
            return fail('Dokumen tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        try:
            document = document_service.revise(document)
        except DomainError as exc:
            return fail(exc.message, errors=exc.errors)
        return ok(DocumentSerializer(document).data, message='Dokumen dikembalikan ke draft untuk revisi')


class DocumentByBimbinganView(_AuthView):
    def get(self, request, bimbingan_aktif_id):
        documents = document_service.list_by_bimbingan(bimbingan_aktif_id)
        return ok(DocumentSerializer(documents, many=True).data)
