import json


class PdfExporter:
    """Exports a Report to PDF bytes.

    Uses reportlab if available; falls back to a plain-text representation
    so the rest of the app works without the optional dependency installed.
    """

    def export(self, report) -> bytes:
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
            from reportlab.lib.styles import getSampleStyleSheet
            import io

            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4)
            styles = getSampleStyleSheet()
            story = [
                Paragraph(report.title, styles['Title']),
                Spacer(1, 12),
                Paragraph(f"Periode: {report.periode}", styles['Normal']),
                Spacer(1, 12),
                Paragraph(json.dumps(report.data, indent=2, ensure_ascii=False), styles['Code']),
            ]
            doc.build(story)
            return buffer.getvalue()
        except ImportError:
            content = f"{report.title}\nPeriode: {report.periode}\n\n{json.dumps(report.data, indent=2, ensure_ascii=False)}"
            return content.encode('utf-8')
