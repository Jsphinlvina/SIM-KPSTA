from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from core.responses import ok, fail

from apps.pengajuan.models import PengajuanKP
from apps.authentication.models import Users
from apps.bimbingan.models import BimbinganAktif, ProsesPenentuan
from apps.bimbingan.serializers import BimbinganAktifSerializer, ProsesPenentuanSerializer
from apps.bimbingan.services.bimbingan_service import BimbinganService

class BimbinganViewSet(viewsets.ModelViewSet):
    queryset = BimbinganAktif.objects.all().select_related('mahasiswa', 'dosen', 'pengajuan')
    serializer_class = BimbinganAktifSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='start-process/(?P<pengajuan_id>[^/.]+)')
    def start_process(self, request, pengajuan_id=None):
        try:
            pengajuan = PengajuanKP.objects.get(pk=pengajuan_id)
            dosen_id = request.data.get('dosen_id')
            if not dosen_id:
                return fail(message="Parameter 'dosen_id' usulan wajib disertakan.")

            dosen = Users.objects.get(pk=dosen_id, role='dosen')
            service = BimbinganService.start_approval_chain(pengajuan, dosen)
            return ok(data=ProsesPenentuanSerializer(service.proses).data, message="Proses rantai kelayakan pembimbing berhasil dimulai.")
        except Exception as e:
            return fail(message=str(e))

    @action(detail=False, methods=['get'], url_path='by-mahasiswa/(?P<mhs_id>[^/.]+)')
    def by_mahasiswa(self, request, mhs_id=None):
        records = self.queryset.filter(mahasiswa_id=mhs_id)
        return ok(data=self.get_serializer(records, many=True).data)

    @action(detail=False, methods=['get'], url_path='by-dosen/(?P<dosen_id>[^/.]+)')
    def by_dosen(self, request, dosen_id=None):
        records = self.queryset.filter(dosen_id=dosen_id)
        return ok(data=self.get_serializer(records, many=True).data)

    @action(detail=False, methods=['get'], url_path='pending-approval')
    def pending_approval(self, request):
        user = request.user
        proses_list = ProsesPenentuan.objects.filter(status='menunggu')

        if user.role == 'koordinator':
            proses_list = proses_list.filter(tahap_chain='koordinator')
        elif user.role == 'dosen':
            proses_list = proses_list.filter(tahap_chain='dosen', dosen_diusulkan=user)
        elif user.role == 'kaprodi':
            proses_list = proses_list.filter(tahap_chain='kaprodi')
        else:
            proses_list = proses_list.none()

        return ok(data=ProsesPenentuanSerializer(proses_list, many=True).data)

    @action(detail=True, methods=['post'], url_path='check-approval')
    def check_approval(self, request, pk=None):
        try:
            proses = ProsesPenentuan.objects.get(pk=pk)
            service = BimbinganService(proses)

            is_reject = request.data.get('reject', False)
            if is_reject:
                alasan = request.data.get('catatan', 'Ditolak oleh tim penguji akademik.')
                service.execute_reject_step(request.user, alasan)
                return ok(message="Respons penolakan rantai kelayakan berhasil dicatat.")

            service.execute_approve_step(request.user)
            return ok(data=ProsesPenentuanSerializer(service.proses).data, message="Approval rantai kelayakan berhasil diproses.")
        except Exception as e:
            return fail(message=str(e))