from django.urls import path

from .views import (
    ArchiveArchiveView,
    ArchiveByLecturerView,
    ArchiveByStudentView,
    ArchiveDetailView,
    ArchiveListCreateView,
    ArchiveRestoreView,
    ArchiveSearchView,
)

urlpatterns = [
    path('', ArchiveListCreateView.as_view()),
    path('search/', ArchiveSearchView.as_view()),
    path('by-mahasiswa/<int:student_id>/', ArchiveByStudentView.as_view()),
    path('by-dosen/<int:lecturer_id>/', ArchiveByLecturerView.as_view()),
    path('<int:record_id>/', ArchiveDetailView.as_view()),
    path('<int:record_id>/archive/', ArchiveArchiveView.as_view()),
    path('<int:record_id>/restore/', ArchiveRestoreView.as_view()),
]
