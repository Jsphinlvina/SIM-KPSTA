import json


class ExcelExporter:
    """Exports a Report to Excel bytes.

    Uses openpyxl if available; falls back to CSV bytes so the rest of
    the app works without the optional dependency installed.
    """

    def export(self, report) -> bytes:
        try:
            import openpyxl
            import io

            wb = openpyxl.Workbook()
            ws = wb.active
            ws.title = report.report_type[:31]
            ws.append(['Title', report.title])
            ws.append(['Periode', report.periode])
            ws.append([])
            ws.append(['Data'])
            ws.append([json.dumps(report.data, ensure_ascii=False)])

            buffer = io.BytesIO()
            wb.save(buffer)
            return buffer.getvalue()
        except ImportError:
            lines = [
                f"Title,{report.title}",
                f"Periode,{report.periode}",
                "",
                json.dumps(report.data, ensure_ascii=False),
            ]
            return "\n".join(lines).encode('utf-8')
