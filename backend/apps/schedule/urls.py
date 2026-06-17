from django.urls import path

from .views import (
    CheckAvailabilityView,
    ConflictsView,
    DefenseByStudentView,
    DefenseDetailView,
    DefenseListCreateView,
    GuidanceByBimbinganView,
    GuidanceCancelView,
    GuidanceCompleteView,
    GuidanceDetailView,
    GuidanceListCreateView,
    GuidanceRescheduleView,
    GuidanceStartView,
    OpenSlotsView,
)

urlpatterns = [
    path('availability/check/', CheckAvailabilityView.as_view()),
    path('availability/slots/', OpenSlotsView.as_view()),
    path('availability/conflicts/', ConflictsView.as_view()),

    path('guidance/', GuidanceListCreateView.as_view()),
    path('guidance/by-bimbingan/<int:bimbingan_aktif_id>/', GuidanceByBimbinganView.as_view()),
    path('guidance/<int:schedule_id>/', GuidanceDetailView.as_view()),
    path('guidance/<int:schedule_id>/start/', GuidanceStartView.as_view()),
    path('guidance/<int:schedule_id>/complete/', GuidanceCompleteView.as_view()),
    path('guidance/<int:schedule_id>/cancel/', GuidanceCancelView.as_view()),
    path('guidance/<int:schedule_id>/reschedule/', GuidanceRescheduleView.as_view()),

    path('defense/', DefenseListCreateView.as_view()),
    path('defense/by-mahasiswa/<int:student_id>/', DefenseByStudentView.as_view()),
    path('defense/<int:defense_id>/', DefenseDetailView.as_view()),
]
