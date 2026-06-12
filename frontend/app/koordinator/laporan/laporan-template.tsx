import React from "react";
import { Users, CheckCircle2, Clock, XCircle, TrendingUp, FileText, Download, FileSpreadsheet } from "lucide-react";

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

export interface LaporanApiData {
  statistik?: {
    total_pengajuan: number;
    per_status: { draft: number; submitted: number; approved: number; rejected: number };
    persentase_disetujui: number;
  };
  distribusi?: Record<
    string,
    { nama_dosen: string; nip: string; jumlah_mahasiswa: number; mahasiswa: { nama: string; nim: string; topik: string }[] }
  >;
  total_dosen?: number;
}

export interface LaporanProps {
  onBack: () => void;
  onTypeChange: (type: "bulanan" | "semester") => void;
  reportType: "bulanan" | "semester";
  apiData?: LaporanApiData;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
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
              Analisis performa &amp; progres pengajuan bulanan Kerja Praktik
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
          <button
            onClick={this.props.onExportPDF}
            className="flex items-center gap-2 px-5 py-3 bg-[#355872] hover:bg-[#7AAACE] text-white rounded-2xl font-semibold text-sm transition shadow-sm cursor-pointer"
          >
            <Download size={16} />
            Export PDF
          </button>
          <button
            onClick={this.props.onExportExcel}
            className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold text-sm transition shadow-sm cursor-pointer"
          >
            <FileSpreadsheet size={16} />
            Export Excel
          </button>
        </div>
      </div>
    );
  }

  protected renderSummaryCards(): React.ReactNode {
    const s = this.props.apiData?.statistik;
    const cards = [
      { label: "Total Pengajuan", value: s?.total_pengajuan ?? "-", sub: "Semua status pengajuan", icon: Clock, color: "bg-amber-50 text-amber-600" },
      { label: "Disetujui", value: s?.per_status?.approved ?? "-", sub: `Tingkat persetujuan ${s?.persentase_disetujui ?? "-"}%`, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
      { label: "Menunggu Persetujuan", value: s?.per_status?.submitted ?? "-", sub: "Perlu ditindaklanjuti", icon: Users, color: "bg-[#EAF4FB] text-[#355872]" },
      { label: "Ditolak", value: s?.per_status?.rejected ?? "-", sub: "Butuh revisi topik", icon: XCircle, color: "bg-red-50 text-red-500" },
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
    const s = this.props.apiData?.statistik;
    const statusData = [
      { label: "Draft", value: s?.per_status?.draft ?? 0, color: "bg-gray-400" },
      { label: "Menunggu", value: s?.per_status?.submitted ?? 0, color: "bg-amber-400" },
      { label: "Disetujui", value: s?.per_status?.approved ?? 0, color: "bg-[#355872]" },
      { label: "Ditolak", value: s?.per_status?.rejected ?? 0, color: "bg-red-400" },
    ];
    const maxVal = Math.max(...statusData.map((d) => d.value), 1);

    const total = s?.total_pengajuan ?? 0;
    const approved = s?.per_status?.approved ?? 0;
    const notApproved = total - approved;
    const approvedPct = total > 0 ? Math.round((approved / total) * 100) : 0;
    const notApprovedPct = 100 - approvedPct;

    return (
      <>
        {/* Chart 1: Status Breakdown Bar Chart */}
        <div className="col-span-2 bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#355872]">Breakdown Status Pengajuan</h2>
              <p className="text-xs text-gray-400 mt-1 font-medium">Distribusi status seluruh pengajuan KP</p>
            </div>
            <TrendingUp size={20} className="text-[#355872]" />
          </div>
          <div className="flex items-end gap-6 h-44">
            {statusData.map((d, i) => {
              const heightPct = (d.value / maxVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-[#355872]">{d.value}</span>
                  <div className="w-full rounded-t-xl bg-[#EAF4FB] relative overflow-hidden" style={{ height: "140px" }}>
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded-t-xl transition-all duration-700 ${d.color}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-400">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Approved vs Others */}
        <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#355872]">Rasio Persetujuan</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Perbandingan disetujui vs belum</p>
          </div>
          <div className="space-y-4 my-6">
            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                <span>Disetujui ({approvedPct}%)</span>
                <span>{approved}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#355872] h-2 rounded-full" style={{ width: `${approvedPct}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                <span>Belum Disetujui ({notApprovedPct}%)</span>
                <span>{notApproved}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#7AAACE] h-2 rounded-full" style={{ width: `${notApprovedPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  protected renderDetailTable(): React.ReactNode {
    const distribusiDict = this.props.apiData?.distribusi;
    const dosenData = distribusiDict
      ? Object.entries(distribusiDict).map(([, info]) => ({
          nama: info.nama_dosen,
          nip: info.nip,
          jumlah: info.jumlah_mahasiswa,
        }))
      : [];

    return (
      <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-[#f0f5fa] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#355872]">Beban Bimbingan per Dosen</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Jumlah mahasiswa aktif per pembimbing</p>
          </div>
          <FileText size={20} className="text-gray-300" />
        </div>
        <div className="divide-y divide-[#eef4f8]">
          {dosenData.length === 0 ? (
            <div className="px-8 py-10 text-center text-gray-400 font-medium">
              Belum ada data bimbingan aktif.
            </div>
          ) : (
            dosenData.map((d, i) => (
              <div key={i} className="px-8 py-4 flex items-center justify-between">
                <span className="font-bold text-[#355872]">{d.nama}</span>
                <span className="text-sm font-semibold text-gray-500">{d.jumlah} Mahasiswa</span>
              </div>
            ))
          )}
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
              Analisis tren kumulatif &amp; statistik sidang satu semester penuh
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
          <button
            onClick={this.props.onExportPDF}
            className="flex items-center gap-2 px-5 py-3 bg-[#355872] hover:bg-[#7AAACE] text-white rounded-2xl font-semibold text-sm transition shadow-sm cursor-pointer"
          >
            <Download size={16} />
            Export PDF
          </button>
          <button
            onClick={this.props.onExportExcel}
            className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold text-sm transition shadow-sm cursor-pointer"
          >
            <FileSpreadsheet size={16} />
            Export Excel
          </button>
        </div>
      </div>
    );
  }

  protected renderSummaryCards(): React.ReactNode {
    const s = this.props.apiData?.statistik;
    const cards = [
      { label: "Total Mahasiswa Terdaftar", value: s?.total_pengajuan ?? "-", sub: "Semua periode", icon: Users, color: "bg-[#EAF4FB] text-[#355872]" },
      { label: "Topik Disetujui", value: s?.per_status?.approved ?? "-", sub: `Tingkat persetujuan ${s?.persentase_disetujui ?? "-"}%`, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
      { label: "Menunggu Persetujuan", value: s?.per_status?.submitted ?? "-", sub: "Perlu ditindaklanjuti segera", icon: Clock, color: "bg-amber-50 text-amber-600" },
      { label: "Topik Ditolak", value: s?.per_status?.rejected ?? "-", sub: "Ditinjau kembali", icon: XCircle, color: "bg-red-50 text-red-500" },
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
    const total = this.props.apiData?.statistik?.total_pengajuan ?? 0;
    const approved = this.props.apiData?.statistik?.per_status?.approved ?? 0;
    const notApproved = total - approved;
    const approvedPct = this.props.apiData?.statistik?.persentase_disetujui ?? 0;
    const breakdown = [
      { label: "Topik Disetujui", value: approved, color: "#355872" },
      { label: "Belum Disetujui", value: notApproved, color: "#7AAACE" },
    ];

    return (
      <>
        {/* Chart 1: Donut diagram */}
        <div className="col-span-2 bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#355872]">Distribusi Status Pengajuan</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Rasio pengajuan yang disetujui vs belum</p>
            <div className="space-y-3 mt-6">
              {breakdown.map((seg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-sm font-semibold text-gray-600">
                    {seg.label}: <strong>{seg.value}</strong>{" "}
                    ({total > 0 ? Math.round((seg.value / total) * 100) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 160 160">
              <circle
                cx="80" cy="80" r="60" fill="none" stroke="#355872" strokeWidth="20"
                strokeDasharray={`${(approved / (total || 1)) * 377} 377`}
                style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
              />
              <circle
                cx="80" cy="80" r="60" fill="none" stroke="#7AAACE" strokeWidth="20"
                strokeDasharray={`${(notApproved / (total || 1)) * 377} 377`}
                strokeDashoffset={`-${(approved / (total || 1)) * 377}`}
                style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
              />
              <text x="80" y="86" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#355872">{total}</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Tingkat Persetujuan */}
        <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#355872]">Tingkat Persetujuan</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Persentase pengajuan yang disetujui</p>
          </div>
          <div className="text-center my-4">
            {total > 0 ? (
              <>
                <h3 className="text-4xl font-extrabold text-[#355872]">{approvedPct}%</h3>
                <p className={`text-xs font-bold mt-1 ${approvedPct >= 70 ? "text-green-600" : "text-amber-500"}`}>
                  {approvedPct >= 70 ? "Sangat Baik" : "Perlu Perhatian"}
                </p>
              </>
            ) : (
              <p className="text-gray-400 font-medium text-sm">Belum ada data pengajuan.</p>
            )}
          </div>
        </div>
      </>
    );
  }

  protected renderDetailTable(): React.ReactNode {
    const distribusiDict = this.props.apiData?.distribusi;
    const dosenData = distribusiDict
      ? Object.entries(distribusiDict).map(([, info]) => ({
          nama: info.nama_dosen,
          nip: info.nip,
          jumlah: info.jumlah_mahasiswa,
        }))
      : [];

    return (
      <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-[#f0f5fa] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#355872]">Beban Bimbingan per Dosen (Semester)</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Jumlah bimbingan aktif semester ini</p>
          </div>
          <FileText size={20} className="text-gray-300" />
        </div>
        <div className="divide-y divide-[#eef4f8]">
          {dosenData.length === 0 ? (
            <div className="px-8 py-10 text-center text-gray-400 font-medium">
              Belum ada data bimbingan aktif.
            </div>
          ) : (
            dosenData.map((d, i) => (
              <div key={i} className="px-8 py-4 flex items-center justify-between">
                <span className="font-bold text-[#355872]">{d.nama}</span>
                <span className="text-sm font-semibold text-gray-500">{d.jumlah} Mahasiswa</span>
              </div>
            ))
          )}
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
