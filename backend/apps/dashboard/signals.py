from django.db.models.signals import post_save
from django.dispatch import receiver


def _trigger_dashboard_refresh(sender, **kwargs):
    from apps.dashboard.services.dashboard_service import DashboardService
    DashboardService.refresh_and_get()


def connect_signals():
    from apps.bimbingan.models import BimbinganAktif
    post_save.connect(_trigger_dashboard_refresh, sender=BimbinganAktif)
