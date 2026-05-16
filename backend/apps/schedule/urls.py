from django.urls import path

from .views import CheckAvailabilityView, ConflictsView, OpenSlotsView

urlpatterns = [
    path('availability/check/', CheckAvailabilityView.as_view()),
    path('availability/slots/', OpenSlotsView.as_view()),
    path('availability/conflicts/', ConflictsView.as_view()),
]
