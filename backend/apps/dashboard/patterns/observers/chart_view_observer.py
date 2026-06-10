from apps.dashboard.patterns.observers.dashboard_observer import DashboardObserver


class ChartViewObserver(DashboardObserver):
    def __init__(self):
        self._last_data = {}

    def update(self, distribusi_data: dict):
        self._last_data = distribusi_data

    def get_chart_data(self):
        labels = []
        values = []
        for dosen_id, info in self._last_data.items():
            labels.append(info.get('nama_dosen', f'Dosen {dosen_id}'))
            values.append(info.get('jumlah_mahasiswa', 0))
        return {'labels': labels, 'values': values}
