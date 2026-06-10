class Report:
    """Plain Python class (not a Django model) representing a generated report."""

    def __init__(self, title: str, periode: str, data: dict, report_type: str):
        self.title = title
        self.periode = periode
        self.data = data
        self.report_type = report_type

    def to_dict(self):
        return {
            'title': self.title,
            'periode': self.periode,
            'report_type': self.report_type,
            'data': self.data,
        }

    def export_to_pdf(self, exporter):
        return exporter.export(self)

    def export_to_excel(self, exporter):
        return exporter.export(self)
