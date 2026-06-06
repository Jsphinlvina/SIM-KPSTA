import React from "react";
import { Users, CheckCircle2, Clock, XCircle, TrendingUp, FileText, Download } from "lucide-react";
import Link from "next/link";

/**
 * Design Patterns (FE):
 * 
 * 1. Template Method Pattern:
 *    - LaporanTemplate (Abstract Class): Mendefinisikan kerangka halaman (Template Method: renderReport()).
 *    - Concrete subclasses meng-override hook renderHeader, renderSummaryCards, renderCharts, dan renderDetailTable.
 * 
 * 2. Factory Pattern:
 *    - LaporanFactory: Membuat objek laporan (LaporanBulanan atau LaporanSemester) secara dinamis.
 */

export interface LaporanProps {
  onBack: () => void;
  onTypeChange: (type: "bulanan" | "semester") => void;
  reportType: "bulanan" | "semester";
}

export abstract class LaporanTemplate {
  protected props: LaporanProps;

  constructor(props: LaporanProps) {
    this.props = props;
  }

  // --- TEMPLATE METHOD ---
  public renderReport(): React.ReactNode {
    return (
      <div className="p-10 w-full">
        {this.renderHeader()}
        {this.renderSummaryCards()}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {this.renderCharts()}
        </div>
        {this.renderDetailTable()}
      </div>
    );
  }

  // --- STANDARD RENDERING HOOKS (Can be overridden) ---

  protected abstract renderHeader(): React.ReactNode;
  protected abstract renderSummaryCards(): React.ReactNode;
  protected abstract renderCharts(): React.ReactNode;
  protected abstract renderDetailTable(): React.ReactNode;
}

// --- CONCRETE IMPLEMENTATION 1: LAPORAN BULANAN ---

export class LaporanBulanan extends LaporanTemplate {
  protected renderHeader(): React.ReactNode {
    return (
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-start gap-4">
          <button
            onClick={this.props.onBack}
            className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872] cursor-pointer"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">
              Laporan Statistik KP (Bulanan)
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Analisis performa & progres pengajuan bulanan Kerja Praktik
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={this.props.reportType}
            onChange={(e) => this.props.onTypeChange(e.target.value as "bulanan" | "semester")}
            className="px-5 py-3 bg-white rounded-2xl border border-[#dbe9f4] text-[#355872] font-semibold text-sm shadow-sm outline-none cursor-pointer"
          >
            <option value="bulanan">Tipe Laporan: Bulanan</option>
            <option value="semester">Tipe Laporan: Semester</option>
          </select>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#355872] hover:bg-[#7AAACE] text-white rounded-2xl font-semibold text-sm transition shadow-sm cursor-pointer">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>
    );
  }

  protected renderSummaryCards(): React.ReactNode {
    const cards = [
      { label: "Pengajuan Bulan Ini", value: 12, sub: "Menunjukkan tren aktif", icon: Clock, color: "bg-amber-50 text-amber-600" },
      { label: "Disetujui Bulan Ini", value: 9, sub: "Tingkat persetujuan 75%", icon: CheckCircle2, color: "bg-green-50 text-green-600" },
      { label: "Bimbingan Aktif", value: 48, sub: "Beban saat ini", icon: Users, color: "bg-[#EAF4FB] text-[#355872]" },
      { label: "Ditolak Bulan Ini", value: 1, sub: "Butuh revisi topik", icon: XCircle, color: "bg-red-50 text-red-500" },
    ];

    return (
      <div className="grid grid-cols-4 gap-5 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${card.color}`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">+10% MoM</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
                <h3 className="text-4xl font-bold text-[#355872] mt-1">{card.value}</h3>
                <p className="text-xs text-gray-400 font-medium mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  protected renderCharts(): React.ReactNode {
    const monthlyData = [
      { bulan: "Jan", jumlah: 5 },
      { bulan: "Feb", jumlah: 8 },
      { bulan: "Mar", jumlah: 14 },
      { bulan: "Apr", jumlah: 11 },
      { bulan: "Mei", jumlah: 7 },
      { bulan: "Jun", jumlah: 3 },
    ];
    const maxMonthly = Math.max(...monthlyData.map((d) => d.jumlah));

    return (
      <>
        {/* Chart 1: Bar Chart Bulanan */}
        <div className="col-span-2 bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#355872]">Tren Pengajuan Bulanan</h2>
              <p className="text-xs text-gray-400 mt-1 font-medium">Beban kerja mahasiswa KP masuk bulanan</p>
            </div>
            <TrendingUp size={20} className="text-[#355872]" />
          </div>
          <div className="flex items-end gap-4 h-44">
            {monthlyData.map((d, i) => {
              const heightPct = (d.jumlah / maxMonthly) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-[#355872]">{d.jumlah}</span>
                  <div className="w-full rounded-t-xl bg-[#EAF4FB] relative overflow-hidden" style={{ height: "140px" }}>
                    <div className="absolute bottom-0 left-0 right-0 rounded-t-xl bg-[#355872] transition-all duration-700" style={{ height: `${heightPct}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-400">{d.bulan}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Legend Jenis Topik Bulanan */}
        <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#355872]">Kategori Topik</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Pilihan jenis topik KP bulan ini</p>
          </div>
          <div className="space-y-4 my-6">
            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                <span>Topik Dosen (65%)</span>
                <span>8</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#355872] h-2 rounded-full" style={{ width: "65%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                <span>Topik Mandiri (35%)</span>
                <span>4</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#7AAACE] h-2 rounded-full" style={{ width: "35%" }} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  protected renderDetailTable(): React.ReactNode {
    const logBimbingan = [
      { tgl: "01 Jun 2026", nama: "Andi Saputra", detail: "Mengirimkan draft Bab 1 Pendahuluan" },
      { tgl: "03 Jun 2026", nama: "Budi Hartono", detail: "Verifikasi proposal KP oleh koordinator" },
      { tgl: "05 Jun 2026", nama: "Citra Lestari", detail: "Penjadwalan sidang disetujui" },
    ];

    return (
      <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-[#f0f5fa] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#355872]">Log Aktivitas Bulanan</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Histori pendaftaran & bimbingan mahasiswa terbaru</p>
          </div>
          <FileText size={20} className="text-gray-300" />
        </div>
        <div className="divide-y divide-[#eef4f8] px-8">
          {logBimbingan.map((log, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between text-sm text-[#355872] font-semibold">
              <span className="text-gray-400">{log.tgl}</span>
              <span className="font-bold">{log.nama}</span>
              <span className="text-gray-500">{log.detail}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// --- CONCRETE IMPLEMENTATION 2: LAPORAN SEMESTER ---

export class LaporanSemester extends LaporanTemplate {
  protected renderHeader(): React.ReactNode {
    return (
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-start gap-4">
          <button
            onClick={this.props.onBack}
            className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872] cursor-pointer"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">
              Laporan Statistik KP (Semester)
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Analisis tren kumulatif & statistik sidang satu semester penuh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={this.props.reportType}
            onChange={(e) => this.props.onTypeChange(e.target.value as "bulanan" | "semester")}
            className="px-5 py-3 bg-white rounded-2xl border border-[#dbe9f4] text-[#355872] font-semibold text-sm shadow-sm outline-none cursor-pointer"
          >
            <option value="bulanan">Tipe Laporan: Bulanan</option>
            <option value="semester">Tipe Laporan: Semester</option>
          </select>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#355872] hover:bg-[#7AAACE] text-white rounded-2xl font-semibold text-sm transition shadow-sm cursor-pointer">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>
    );
  }

  protected renderSummaryCards(): React.ReactNode {
    const cards = [
      { label: "Total Mahasiswa Terdaftar", value: 48, sub: "Periode Genap 2025/2026", icon: Users, color: "bg-[#EAF4FB] text-[#355872]" },
      { label: "Topik Disetujui", value: 35, sub: "Tingkat persetujuan 72.9%", icon: CheckCircle2, color: "bg-green-50 text-green-600" },
      { label: "Menunggu Persetujuan", value: 9, sub: "Perlu ditindaklanjuti segera", icon: Clock, color: "bg-amber-50 text-amber-600" },
      { label: "Topik Ditolak", value: 4, sub: "Ditinjau kembali", icon: XCircle, color: "bg-red-50 text-red-500" },
    ];

    return (
      <div className="grid grid-cols-4 gap-5 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${card.color}`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">+12% YoY</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
                <h3 className="text-4xl font-bold text-[#355872] mt-1">{card.value}</h3>
                <p className="text-xs text-gray-400 font-medium mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  protected renderCharts(): React.ReactNode {
    const breakdown = [
      { label: "Topik Dosen", value: 28, color: "#355872" },
      { label: "Topik Mandiri", value: 20, color: "#7AAACE" },
    ];
    const total = 48;

    return (
      <>
        {/* Chart 1: Donut diagram */}
        <div className="col-span-2 bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#355872]">Distribusi Jenis Topik</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Rasio pengajuan topik bimbingan</p>
            <div className="space-y-3 mt-6">
              {breakdown.map((seg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-sm font-semibold text-gray-600">
                    {seg.label}: <strong>{seg.value}</strong> ({Math.round((seg.value / total) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Custom SVG render */}
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="60" fill="none" stroke="#355872" strokeWidth="20" strokeDasharray="230 147" style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
              <circle cx="80" cy="80" r="60" fill="none" stroke="#7AAACE" strokeWidth="20" strokeDasharray="147 230" strokeDashoffset="-230" style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
              <text x="80" y="86" textAnchor="middle" className="text-2xl" fontSize="22" fontWeight="bold" fill="#355872">{total}</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Ringkasan Kelulusan Sidang */}
        <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#355872]">Kelulusan Sidang</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Statistik mahasiswa lulus sidang KP</p>
          </div>
          <div className="text-center my-4">
            <h3 className="text-4xl font-extrabold text-[#355872]">94.2%</h3>
            <p className="text-xs text-green-600 font-bold mt-1">Sangat Memuaskan</p>
          </div>
        </div>
      </>
    );
  }

  protected renderDetailTable(): React.ReactNode {
    const dosenData = [
      { nama: "Dr. Budi Santoso, M.T.", nip: "72001", jumlah: 9, max: 10, status: "Hampir Penuh" },
      { nama: "Siti Aisyah, S.Si, M.Kom", nip: "72002", jumlah: 7, max: 10, status: "Aktif" },
      { nama: "Rizky Maulana, M.Sc", nip: "72003", jumlah: 6, max: 10, status: "Aktif" },
      { nama: "Dewi Permata, M.T.", nip: "72004", jumlah: 5, max: 10, status: "Aktif" },
    ];

    return (
      <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-[#f0f5fa] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#355872]">Beban Bimbingan per Dosen (Semester)</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Jumlah bimbingan semester ini</p>
          </div>
          <FileText size={20} className="text-gray-300" />
        </div>
        <div className="divide-y divide-[#eef4f8]">
          {dosenData.map((d, i) => (
            <div key={i} className="px-8 py-4 flex items-center justify-between">
              <span className="font-bold text-[#355872]">{d.nama}</span>
              <span className="text-sm font-semibold text-gray-500">{d.jumlah} / {d.max} Mahasiswa</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// --- FACTORY PATTERN ---

export class LaporanFactory {
  public static createReport(
    type: "bulanan" | "semester",
    props: LaporanProps
  ): LaporanTemplate {
    if (type === "semester") {
      return new LaporanSemester(props);
    }
    return new LaporanBulanan(props);
  }
}
