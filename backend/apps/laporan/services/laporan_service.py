from apps.laporan.patterns.factory.laporan_factory_impl import LaporanFactoryImpl


class LaporanService:
    _factory = LaporanFactoryImpl()

    @classmethod
    def generate(cls, report_type: str, periode_id=None):
        generator = cls._factory.create_laporan(report_type)
        return generator.generate_laporan(periode_id)

    @classmethod
    def list_types(cls):
        return list(LaporanFactoryImpl._REGISTRY.keys())
