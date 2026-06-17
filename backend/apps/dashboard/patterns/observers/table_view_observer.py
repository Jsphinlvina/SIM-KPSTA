from apps.dashboard.patterns.observers.dashboard_observer import DashboardObserver


class TableViewObserver(DashboardObserver):
    def __init__(self):
        self._last_data = {}

    def update(self, distribusi_data: dict):
        self._last_data = distribusi_data

    def get_table_data(self):
        rows = []
        for dosen_id, info in self._last_data.items():
            rows.append({
                'dosen_id': dosen_id,
                'nama_dosen': info.get('nama_dosen'),
                'jumlah_mahasiswa': info.get('jumlah_mahasiswa', 0),
                'mahasiswa': info.get('mahasiswa', []),
            })
        return rows
