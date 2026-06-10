from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from core.responses import ok, fail
from core.permissions import IsDosenOrKoordinatorOrKaprodi

from apps.dashboard.services.dashboard_service import DashboardService


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsDosenOrKoordinatorOrKaprodi]

    @action(detail=False, methods=['get'], url_path='distribusi')
    def distribusi(self, request):
        data = DashboardService.refresh_and_get()
        return ok(data=data, message="Data distribusi pembimbing berhasil dimuat.")

    @action(detail=False, methods=['get'], url_path=r'distribusi/by-dosen/(?P<dosen_id>[^/.]+)')
    def distribusi_by_dosen(self, request, dosen_id=None):
        data = DashboardService.get_distribusi_by_dosen(int(dosen_id))
        if data is None:
            return fail(message="Data distribusi untuk dosen ini tidak ditemukan.")
        return ok(data=data, message=f"Distribusi dosen ID {dosen_id} berhasil dimuat.")

    @action(detail=False, methods=['get'], url_path='distribusi/table')
    def distribusi_table(self, request):
        data = DashboardService.get_table_data()
        return ok(data=data, message="Data tabel distribusi berhasil dimuat.")

    @action(detail=False, methods=['get'], url_path='distribusi/chart')
    def distribusi_chart(self, request):
        data = DashboardService.get_chart_data()
        return ok(data=data, message="Data chart distribusi berhasil dimuat.")

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        data = DashboardService.get_summary()
        return ok(data=data, message="Ringkasan dashboard berhasil dimuat.")
