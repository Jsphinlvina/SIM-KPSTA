import io


class PdfExporter:
    """Exports a Report to a properly formatted PDF.

    reportlab is imported lazily inside export() so Django starts even if the
    package is not installed in the current environment.
    """

    def export(self, report) -> bytes:
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.lib import colors
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import cm
            from reportlab.platypus import (
                SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
            )
        except ImportError:
            raise RuntimeError("reportlab is not installed. Run: pip install reportlab")

        # ── colour palette ──────────────────────────────────────────────────
        BLUE       = colors.HexColor("#355872")
        LIGHT_BLUE = colors.HexColor("#EAF4FB")
        GRAY       = colors.HexColor("#6b7280")

        # ── document ────────────────────────────────────────────────────────
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, pagesize=A4,
            rightMargin=2*cm, leftMargin=2*cm,
            topMargin=2*cm, bottomMargin=2*cm,
        )

        # ── styles ──────────────────────────────────────────────────────────
        base = getSampleStyleSheet()
        title_sty = ParagraphStyle(
            "RPTitle", parent=base["Title"],
            textColor=BLUE, fontSize=18, spaceAfter=4,
        )
        sub_sty = ParagraphStyle(
            "RPSub", parent=base["Normal"],
            textColor=GRAY, fontSize=10, spaceAfter=2,
        )
        section_sty = ParagraphStyle(
            "RPSection", parent=base["Normal"],
            textColor=BLUE, fontSize=12, fontName="Helvetica-Bold",
            spaceBefore=14, spaceAfter=6,
        )
        normal_sty = ParagraphStyle(
            "RPNormal", parent=base["Normal"],
            fontSize=10, textColor=colors.HexColor("#374151"),
        )
        dosen_sty = ParagraphStyle(
            "RPDosen", parent=base["Normal"],
            textColor=BLUE, fontSize=10, fontName="Helvetica-Bold",
            spaceBefore=8, spaceAfter=4,
        )
        empty_sty = ParagraphStyle(
            "RPEmpty", parent=base["Normal"],
            fontSize=9, textColor=GRAY, spaceAfter=4,
        )

        # ── helper: build a styled table ───────────────────────────────────
        def make_table(rows):
            t = Table(rows, repeatRows=1)
            cmds = [
                ("BACKGROUND",    (0, 0), (-1, 0),  BLUE),
                ("TEXTCOLOR",     (0, 0), (-1, 0),  colors.white),
                ("FONTNAME",      (0, 0), (-1, 0),  "Helvetica-Bold"),
                ("FONTSIZE",      (0, 0), (-1, 0),  10),
                ("ALIGN",         (0, 0), (-1, 0),  "LEFT"),
                ("TOPPADDING",    (0, 0), (-1, 0),  8),
                ("BOTTOMPADDING", (0, 0), (-1, 0),  8),
                ("FONTNAME",      (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE",      (0, 1), (-1, -1), 9),
                ("TOPPADDING",    (0, 1), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 1), (-1, -1), 6),
                ("LEFTPADDING",   (0, 0), (-1, -1), 8),
                ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
                ("GRID",          (0, 0), (-1, -1), 0.5, colors.HexColor("#d1d5db")),
                ("BOX",           (0, 0), (-1, -1), 1,   BLUE),
            ]
            for i in range(1, len(rows)):
                bg = LIGHT_BLUE if i % 2 == 0 else colors.white
                cmds.append(("BACKGROUND", (0, i), (-1, i), bg))
            t.setStyle(TableStyle(cmds))
            return t

        # ── story ───────────────────────────────────────────────────────────
        story = []
        story.append(Paragraph(report.title, title_sty))
        story.append(Paragraph(f"Periode: {report.periode}", sub_sty))
        story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceAfter=12))

        data = report.data

        # ── statistik_pengajuan ──────────────────────────────────────────────
        if report.report_type == "statistik_pengajuan":
            story.append(Paragraph("Ringkasan Pengajuan", section_sty))
            total      = data.get("total_pengajuan", 0)
            per_status = data.get("per_status", {})
            pct        = data.get("persentase_disetujui", 0)

            story.append(make_table([
                ["Keterangan",            "Jumlah"],
                ["Total Pengajuan",       str(total)],
                ["Draft",                 str(per_status.get("draft", 0))],
                ["Menunggu Persetujuan",  str(per_status.get("submitted", 0))],
                ["Disetujui",             str(per_status.get("approved", 0))],
                ["Ditolak",               str(per_status.get("rejected", 0))],
                ["Tingkat Persetujuan",   f"{pct}%"],
            ]))
            story.append(Spacer(1, 12))

            top_dosen = data.get("top_5_dosen")
            if top_dosen:
                story.append(Paragraph("Top 5 Dosen Pembimbing", section_sty))
                rows = [["Nama Dosen", "Jumlah Mahasiswa"]]
                for entry in top_dosen:
                    rows.append([entry.get("nama_dosen", "-"), str(entry.get("jumlah_mahasiswa", 0))])
                story.append(make_table(rows))

        # ── distribusi_dosen ─────────────────────────────────────────────────
        elif report.report_type == "distribusi_dosen":
            distribusi  = data.get("distribusi", {})
            total_dosen = data.get("total_dosen", 0)

            story.append(Paragraph("Distribusi Beban Bimbingan Dosen", section_sty))
            story.append(Paragraph(f"Total Dosen Pembimbing Aktif: {total_dosen}", normal_sty))
            story.append(Spacer(1, 8))

            if not distribusi:
                story.append(Paragraph("Belum ada data distribusi dosen.", normal_sty))
            else:
                rows = [["No", "Nama Dosen", "NIP", "Jumlah Mahasiswa"]]
                for idx, (_, info) in enumerate(distribusi.items(), start=1):
                    rows.append([
                        str(idx),
                        info.get("nama_dosen", "-"),
                        info.get("nip", "-"),
                        str(info.get("jumlah_mahasiswa", 0)),
                    ])
                story.append(make_table(rows))

                story.append(Spacer(1, 16))
                story.append(Paragraph("Detail Mahasiswa per Dosen", section_sty))
                for _, info in distribusi.items():
                    story.append(Paragraph(
                        f"{info.get('nama_dosen', '-')} ({info.get('nip', '-')})",
                        dosen_sty,
                    ))
                    mhs_list = info.get("mahasiswa", [])
                    if mhs_list:
                        mhs_rows = [["No", "Nama Mahasiswa", "NIM", "Topik"]]
                        for i, mhs in enumerate(mhs_list, start=1):
                            mhs_rows.append([
                                str(i),
                                mhs.get("nama", "-"),
                                mhs.get("nim", "-"),
                                mhs.get("topik", "-"),
                            ])
                        story.append(make_table(mhs_rows))
                    else:
                        story.append(Paragraph("Belum ada mahasiswa.", empty_sty))

        # ── generic fallback ─────────────────────────────────────────────────
        else:
            for key, val in data.items():
                story.append(Paragraph(str(key).replace("_", " ").title(), section_sty))
                story.append(Paragraph(str(val), normal_sty))

        doc.build(story)
        return buffer.getvalue()
