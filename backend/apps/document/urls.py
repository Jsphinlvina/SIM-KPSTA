from django.urls import path

from .views import (
    DocumentByBimbinganView,
    DocumentDetailView,
    DocumentListView,
    DocumentRejectView,
    DocumentReviseView,
    DocumentVerifyView,
    FinalReportUploadView,
    ProposalUploadView,
)

urlpatterns = [
    path('', DocumentListView.as_view()),
    path('upload/proposal/', ProposalUploadView.as_view()),
    path('upload/laporan-akhir/', FinalReportUploadView.as_view()),
    path('by-bimbingan/<int:bimbingan_aktif_id>/', DocumentByBimbinganView.as_view()),
    path('<int:document_id>/', DocumentDetailView.as_view()),
    path('<int:document_id>/verify/', DocumentVerifyView.as_view()),
    path('<int:document_id>/reject/', DocumentRejectView.as_view()),
    path('<int:document_id>/revise/', DocumentReviseView.as_view()),
]
