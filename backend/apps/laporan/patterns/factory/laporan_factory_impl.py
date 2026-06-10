from apps.laporan.patterns.factory.laporan_factory import LaporanFactory
from apps.laporan.patterns.template_method.laporan_distribusi_dosen import LaporanDistribusiDosen
from apps.laporan.patterns.template_method.laporan_statistik_pengajuan import LaporanStatistikPengajuan


class LaporanFactoryImpl(LaporanFactory):
    _REGISTRY = {
        'distribusi_dosen': LaporanDistribusiDosen,
        'statistik_pengajuan': LaporanStatistikPengajuan,
    }

    def create_laporan(self, report_type: str):
        klass = self._REGISTRY.get(report_type)
        if klass is None:
            raise ValueError(f"Jenis laporan '{report_type}' tidak dikenali.")
        return klass()
