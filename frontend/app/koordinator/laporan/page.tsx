"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LaporanFactory } from "./laporan-template";

export default function LaporanStatistikPage() {
  const router = useRouter();
  const [reportType, setReportType] = useState<"bulanan" | "semester">("semester");

  // Instansiasi Laporan menggunakan Factory Pattern
  const report = LaporanFactory.createReport(reportType, {
    reportType,
    onBack: () => router.push("/koordinator"),
    onTypeChange: (type) => setReportType(type),
  });

  // Render menggunakan Template Method Pattern
  return (
    <div className="min-h-screen bg-[#F7F8F0] w-full">
      {report.renderReport()}
    </div>
  );
}
