"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/app/components/sidebar";
import { CheckCircle2, Search, X } from "lucide-react";

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

    // Opsi A: placeholder UI (tanpa API). Simulasi latency.
    await new Promise((r) => setTimeout(r, 500));

    setRows((prev) =>
      prev.map((row) =>
        row.id === mahasiswaId ? { ...row, pembimbingId: dosenId } : row
      )
    );

    setSavingId(null);
    setToast("Berhasil menetapkan dosen pembimbing (placeholder)." );
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
              Admin menetapkan dosen pembimbing untuk mahasiswa.
            </p>
          </div>

          <div className="text-[#355872] font-medium">
            Admin
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
            className="grid grid-cols-5 gap-0 bg-[#EAF4FB] px-6 py-5 font-semibold text-[#355872]"
          >
            <div className="col-span-1">No</div>
            <div className="col-span-2">Mahasiswa</div>
            <div className="col-span-1">Topik</div>
            <div className="col-span-1">Pembimbing</div>
          </div>

          <div className="divide-y divide-[#eef4f8]">
            {filtered.map((row, idx) => (
              <div
                key={row.id}
                className="grid grid-cols-5 px-6 py-5 items-center"
              >
                <div className="col-span-1 text-[#355872] font-medium">
                  {idx + 1}
                </div>

                <div className="col-span-2">
                  <div className="font-semibold text-[#355872]">{row.nama}</div>
                  <div className="text-sm text-gray-500">
                    ID: {row.id}
                  </div>
                </div>

                <div className="col-span-1 text-sm text-gray-700">
                  {row.topik}
                </div>

                <div className="col-span-1 flex flex-col gap-2">
                  <div className="text-xs text-gray-500">
                    Status: {pembimbingLabel(row.pembimbingId)}
                  </div>

                  <div className="flex gap-2">
                    <select
                      disabled={savingId === row.id}
                      value={row.pembimbingId ?? ""}
                      onChange={(e) => {
                        const nextId = Number(e.target.value);
                        if (!Number.isFinite(nextId)) return;
                        handleAssign(row.id, nextId);
                      }}
                      className="flex-1 h-10 rounded-xl border border-[#9CD5FF] px-3 outline-none focus:ring-2 focus:ring-[#7AAACE] bg-white text-sm disabled:opacity-70"
                    >
                      <option value="" disabled>
                        Pilih dosen
                      </option>
                      {dosenList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nama}
                        </option>
                      ))}
                    </select>

                    <div
                      className="w-10 h-10 rounded-xl bg-[#EAF4FB] flex items-center justify-center text-[#355872]"
                      title="Simulasi status"
                    >
                      {row.pembimbingId ? (
                        <CheckCircle2 size={18} className="text-green-600" />
                      ) : savingId === row.id ? (
                        <span className="text-sm">...</span>
                      ) : (
                        <span className="text-sm">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                Tidak ada data.
              </div>
            ) : null}
          </div>
        </div>

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

