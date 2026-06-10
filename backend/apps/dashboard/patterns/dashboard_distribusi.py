from apps.dashboard.patterns.observers.dashboard_observer import DashboardObserver
from apps.dashboard.patterns.observers.table_view_observer import TableViewObserver
from apps.dashboard.patterns.observers.chart_view_observer import ChartViewObserver


class DashboardDistribusi:
    """Singleton + Subject (Observer)."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._observers: list[DashboardObserver] = []
            cls._instance._distribusi_data: dict = {}
            cls._instance._table_observer = TableViewObserver()
            cls._instance._chart_observer = ChartViewObserver()
            cls._instance.attach(cls._instance._table_observer)
            cls._instance.attach(cls._instance._chart_observer)
        return cls._instance

    # --- Observer interface ---

    def attach(self, observer: DashboardObserver):
        if observer not in self._observers:
            self._observers.append(observer)

    def detach(self, observer: DashboardObserver):
        self._observers.remove(observer)

    def notify(self):
        for observer in self._observers:
            observer.update(self._distribusi_data)

    # --- Subject state ---

    def set_distribusi_data(self, data: dict):
        self._distribusi_data = data
        self.notify()

    def get_distribusi_data(self):
        return self._distribusi_data

    def get_table_data(self):
        return self._table_observer.get_table_data()

    def get_chart_data(self):
        return self._chart_observer.get_chart_data()
