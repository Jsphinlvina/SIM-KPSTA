"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LaporanFactory, LaporanApiData } from "./laporan-template";
import api from "../../api";

export default function LaporanStatistikPage() {
  const router = useRouter();
  const [reportType, setReportType] = useState<"bulanan" | "semester">("semester");
  const [apiData, setApiData] = useState<LaporanApiData | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statistikRes, distribusiRes] = await Promise.all([
          api.get("/laporan/statistik-pengajuan/"),
          api.get("/laporan/distribusi-dosen/"),
        ]);
        setApiData({
          statistik: statistikRes.data.data?.data,
          distribusi: distribusiRes.data.data?.data?.distribusi,
          total_dosen: distribusiRes.data.data?.data?.total_dosen,
        });
      } catch (err) {
        console.error("Gagal memuat data laporan:", err);
      }
    };
    fetchData();
  }, []);

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    try {
      const reportTypeKey = reportType === "semester" ? "distribusi_dosen" : "statistik_pengajuan";
      const res = await api.post("/laporan/export-pdf/", { report_type: reportTypeKey }, { responseType: "blob" });
      triggerDownload(new Blob([res.data]), `laporan-${reportTypeKey}.pdf`);
    } catch (err) {
      console.error("Export PDF gagal:", err);
    }
  };

  const handleExportExcel = async () => {
    try {
      const reportTypeKey = reportType === "semester" ? "distribusi_dosen" : "statistik_pengajuan";
      const res = await api.post("/laporan/export-excel/", { report_type: reportTypeKey }, { responseType: "blob" });
      triggerDownload(new Blob([res.data]), `laporan-${reportTypeKey}.xlsx`);
    } catch (err) {
      console.error("Export Excel gagal:", err);
    }
  };

  // Factory Pattern: creates the correct LaporanTemplate subclass
  const report = LaporanFactory.createReport(reportType, {
    reportType,
    onBack: () => router.push("/koordinator"),
    onTypeChange: (type) => setReportType(type),
    apiData,
    onExportPDF: handleExportPDF,
    onExportExcel: handleExportExcel,
  });

  // Template Method Pattern: renderReport() calls abstract hooks in order
  return (
    <div className="min-h-screen bg-[#F7F8F0] w-full">
      {report.renderReport()}
    </div>
  );
}
