"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/app/components/sidebar";
import { CheckCircle2, Search, X, UserPlus, UserCheck, AlertCircle } from "lucide-react";

type Dosen = {
  id: number;
  nama: string;
};

type MahasiswaRow = {
  id: number;
  nama: string;
  topik: string;
  pembimbingId?: number;
};

export default function PenentuanDosenPembimbingPage() {
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // States for Assign Modal and Confirm Flow
  const [activeMahasiswa, setActiveMahasiswa] = useState<MahasiswaRow | null>(null);
  const [tempDosenId, setTempDosenId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const dosenList: Dosen[] = useMemo(
    () => [
      { id: 1, nama: "Budi Santoso, S.Kom, M.T" },
      { id: 2, nama: "Siti Aisyah, S.Si, M.Kom" },
      { id: 3, nama: "Rizky Maulana, M.Sc" },
    ],
    []
  );

  const [rows, setRows] = useState<MahasiswaRow[]>([
    {
      id: 1,
      nama: "Andi Saputra",
      topik: "Sistem Informasi KP",
    },
    {
      id: 2,
      nama: "Budi Hartono",
      topik: "AI untuk Edukasi",
    },
    {
      id: 3,
      nama: "Citra Lestari",
      topik: "Web Monitoring KP",
    },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      return (
        r.nama.toLowerCase().includes(q) ||
        r.topik.toLowerCase().includes(q)
      );
    });
  }, [query, rows]);

  const handleAssign = async (mahasiswaId: number, dosenId: number) => {
    setSavingId(mahasiswaId);

    // Simulate server latency
    await new Promise((r) => setTimeout(r, 600));

    setRows((prev) =>
      prev.map((row) =>
        row.id === mahasiswaId ? { ...row, pembimbingId: dosenId } : row
      )
    );

    setSavingId(null);
    setToast("Berhasil menetapkan dosen pembimbing.");
    setTimeout(() => setToast(null), 2500);
  };

  const pembimbingLabel = (pembimbingId?: number) => {
    if (!pembimbingId) return "Belum ditetapkan";
    return dosenList.find((d) => d.id === pembimbingId)?.nama ?? "";
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8F0]">
      <Sidebar />

      <div className="flex-1 p-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#355872]">
              Penentuan Dosen Pembimbing
            </h1>
            <p className="text-gray-500 mt-2">
              Koordinator menetapkan dosen pembimbing untuk mahasiswa.
            </p>
          </div>

          <div className="text-[#355872] font-medium bg-[#EAF4FB] px-4 py-2 rounded-xl border border-[#9CD5FF]/20 shadow-sm">
            Koordinator KP/TA
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#EAF4FB] text-[#355872]">
              <Search size={18} />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari mahasiswa atau topik..."
              className="flex-1 h-12 rounded-xl border border-[#9CD5FF] px-4 outline-none focus:ring-2 focus:ring-[#7AAACE]"
            />
            {query.trim() ? (
              <button
                onClick={() => setQuery("")}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 cursor-pointer"
                aria-label="Clear"
              >
                <X size={18} />
              </button>
            ) : null}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] overflow-hidden">
          <div
            className="grid grid-cols-12 gap-4 bg-[#EAF4FB] px-8 py-5 font-semibold text-[#355872]"
          >
            <div className="col-span-1">No</div>
            <div className="col-span-3">Mahasiswa</div>
            <div className="col-span-3">Topik Pengajuan</div>
            <div className="col-span-3">Dosen Pembimbing</div>
            <div className="col-span-2 text-right pr-4">Aksi</div>
          </div>

          <div className="divide-y divide-[#eef4f8]">
            {filtered.map((row, idx) => (
              <div
                key={row.id}
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-[#F7F8F0]/30 transition"
              >
                {/* 1. No */}
                <div className="col-span-1 text-[#355872] font-semibold text-lg">
                  {idx + 1}
                </div>

                {/* 2. Mahasiswa */}
                <div className="col-span-3">
                  <div className="font-bold text-[#355872] text-lg">{row.nama}</div>
                  <div className="text-sm text-gray-500 font-medium mt-0.5">
                    NIM: 22720{row.id}0{row.id}
                  </div>
                </div>

                {/* 3. Topik */}
                <div className="col-span-3 text-sm text-[#355872] font-medium pr-4">
                  {row.topik}
                </div>

                {/* 4. Dosen Pembimbing Status */}
                <div className="col-span-3">
                  {row.pembimbingId ? (
                    <div className="space-y-1.5">
                      <p className="font-bold text-[#355872] leading-tight">
                        {pembimbingLabel(row.pembimbingId)}
                      </p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Telah Ditetapkan
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Menunggu Alokasi
                    </span>
                  )}
                </div>

                {/* 5. Aksi Button */}
                <div className="col-span-2 flex items-center justify-end pr-2">
                  {row.pembimbingId ? (
                    <button
                      onClick={() => {
                        setActiveMahasiswa(row);
                        setTempDosenId(row.pembimbingId ?? null);
                        setShowConfirm(false);
                      }}
                      className="
                        flex
                        items-center
                        gap-1.5
                        px-4
                        py-2
                        bg-white
                        hover:bg-gray-50
                        text-[#355872]
                        border
                        border-[#dbe9f4]
                        rounded-xl
                        text-sm
                        font-bold
                        shadow-sm
                        transition-all
                        duration-200
                        cursor-pointer
                      "
                    >
                      <UserCheck size={16} />
                      Ubah Dosen
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveMahasiswa(row);
                        setTempDosenId(null);
                        setShowConfirm(false);
                      }}
                      className="
                        flex
                        items-center
                        gap-1.5
                        px-4
                        py-2
                        bg-[#EAF4FB]
                        hover:bg-[#355872]
                        hover:text-white
                        text-[#355872]
                        border
                        border-[#9CD5FF]/30
                        rounded-xl
                        text-sm
                        font-bold
                        shadow-sm
                        transition-all
                        duration-200
                        cursor-pointer
                      "
                    >
                      <UserPlus size={16} />
                      Pilih Dosen
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500 font-medium">
                Tidak ada data mahasiswa yang mengajukan topik.
              </div>
            ) : null}
          </div>
        </div>

        {/* Modal Alokasi Pembimbing */}
        {activeMahasiswa && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative border border-[#e6eef5]">
              
              {/* Close Button */}
              <button
                onClick={() => setActiveMahasiswa(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer"
              >
                <X size={20} />
              </button>

              {!showConfirm ? (
                <>
                  <h2 className="text-2xl font-bold text-[#355872] mb-2">
                    Pilih Dosen Pembimbing
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Tentukan dosen pembimbing yang paling sesuai untuk usulan topik mahasiswa ini.
                  </p>

                  {/* Student Profile Card */}
                  <div className="bg-[#EAF4FB] rounded-2xl p-5 border border-[#9CD5FF]/20 mb-6">
                    <p className="text-xs font-bold text-[#355872]/70 uppercase tracking-wider mb-2">
                      Mahasiswa & Topik
                    </p>
                    <h3 className="font-bold text-lg text-[#355872]">
                      {activeMahasiswa.nama}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">
                      NIM: 22720{activeMahasiswa.id}0{activeMahasiswa.id}
                    </p>
                    <div className="mt-3 pt-3 border-t border-[#9CD5FF]/20">
                      <p className="text-sm text-[#355872] font-semibold">
                        Topik: {activeMahasiswa.topik}
                      </p>
                    </div>
                  </div>

                  {/* Dosen Selector List */}
                  <div className="space-y-2 mb-8 max-h-60 overflow-y-auto pr-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                      Daftar Dosen Tersedia
                    </p>
                    {dosenList.map((dosen) => {
                      const isSelected = tempDosenId === dosen.id;
                      return (
                        <div
                          key={dosen.id}
                          onClick={() => setTempDosenId(dosen.id)}
                          className={`
                            flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer
                            ${
                              isSelected
                                ? "border-[#355872] bg-[#355872]/5 shadow-sm"
                                : "border-[#e6eef5] hover:border-[#9CD5FF] hover:bg-[#F7F8F0]/50"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? "border-[#355872] bg-[#355872]" : "border-gray-300 bg-white"
                            }`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                            </div>
                            <span className="font-bold text-[#355872] text-sm">{dosen.nama}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 border-t border-[#f0f5fa] pt-5">
                    <button
                      onClick={() => setActiveMahasiswa(null)}
                      className="px-5 py-2.5 rounded-xl border border-[#dbe9f4] text-gray-600 hover:bg-gray-50 font-semibold text-sm transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      disabled={tempDosenId === null}
                      onClick={() => setShowConfirm(true)}
                      className="px-5 py-2.5 rounded-xl bg-[#355872] text-white hover:bg-[#2c475d] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition shadow-md cursor-pointer"
                    >
                      Lanjutkan
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#355872] mb-6 flex items-center gap-2">
                    Konfirmasi Penetapan
                  </h2>

                  <div className="space-y-5 mb-8">
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3 text-amber-800">
                      <AlertCircle size={20} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">
                          Apakah Anda yakin ingin menetapkan dosen pembimbing berikut untuk mahasiswa ini? Keputusan ini akan dicatat dalam sistem penentuan berjenjang.
                        </p>
                      </div>
                    </div>

                    <div className="border border-[#e6eef5] rounded-2xl p-5 space-y-3 bg-[#F7F8F0]/50">
                      <div>
                        <span className="text-xs text-gray-500 block font-semibold">Mahasiswa</span>
                        <span className="font-bold text-[#355872]">{activeMahasiswa.nama}</span>
                      </div>
                      <div className="border-t border-[#e6eef5] pt-2">
                        <span className="text-xs text-gray-500 block font-semibold">Topik Usulan</span>
                        <span className="font-semibold text-sm text-[#355872]">{activeMahasiswa.topik}</span>
                      </div>
                      <div className="border-t border-[#e6eef5] pt-2">
                        <span className="text-xs text-gray-500 block font-semibold">Dosen Pembimbing Terpilih</span>
                        <span className="font-bold text-[#355872] text-lg block mt-0.5">
                          {dosenList.find(d => d.id === tempDosenId)?.nama}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Confirm */}
                  <div className="flex justify-end gap-3 border-t border-[#f0f5fa] pt-5">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-5 py-2.5 rounded-xl border border-[#dbe9f4] text-gray-600 hover:bg-gray-50 font-semibold text-sm transition cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => {
                        if (tempDosenId !== null) {
                          handleAssign(activeMahasiswa.id, tempDosenId);
                          setActiveMahasiswa(null);
                        }
                      }}
                      className="px-6 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 font-semibold text-sm transition shadow-md cursor-pointer"
                    >
                      Ya, Tetapkan
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}

        {/* Toast */}
        {toast ? (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-10 z-50">
            <div className="bg-[#355872] text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">{toast}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
