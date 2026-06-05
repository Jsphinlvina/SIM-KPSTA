"use client";

import { useMemo, useState } from "react";
// import Sidebar from "@/app/components/sidebar";
import { CheckCircle2, Search, X, UserPlus, UserCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DetailDosen from "./detail-dosen";

type Dosen = {
  id: number;
  nama: string;
};

type MahasiswaRow = {
  id: number;
  nama: string;
  topik: string;
  jenisTopik: "dosen" | "mandiri";
  pembimbingId?: number;
};

export default function PenentuanDosenPembimbingPage() {
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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
      jenisTopik: "dosen",
      pembimbingId: 1,
    },
    {
      id: 2,
      nama: "Budi Hartono",
      topik: "AI untuk Edukasi",
      jenisTopik: "mandiri",
    },
    {
      id: 3,
      nama: "Citra Lestari",
      topik: "Web Monitoring KP",
      jenisTopik: "dosen",
      pembimbingId: 2,
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
      {/* <Sidebar /> */}

      <div className="flex-1 p-10">
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <Link
              href="/koordinator"
              className="
                mt-1
                p-2
                rounded-full
                hover:bg-[#EAF4FB]
                transition
                text-[#355872]
              "
            >
              <ArrowLeft size={32} />
            </Link>

            <div>
              <h1 className="text-4xl font-bold text-[#355872]">
                Penentuan Dosen Pembimbing
              </h1>

              <p className="text-gray-500 mt-2">
                Menentukan dosen pembimbing untuk mahasiswa yang telah disetujui.
              </p>
            </div>
          </div>

          <div
            className="
              px-5
              py-3
              bg-white
              rounded-xl
              border
              border-[#dbe9f4]
              text-[#355872]
              font-medium
            "
          >
            Genap 2025/2026
          </div>
        </div>

        {/* Search */}
        {/* <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-6 mb-8">
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
        </div> */}

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] overflow-hidden">
          
          {/* Header Tabel (Total 12 Kolom) */}
          <div className="grid grid-cols-12 gap-4 bg-[#EAF4FB] px-8 py-5 font-semibold text-[#355872] items-center">
            <div className="col-span-1">No</div>
            <div className="col-span-2">Mahasiswa</div>
            <div className="col-span-2">Topik</div>
            <div className="col-span-3">Topik Pengajuan</div>
            <div className="col-span-2">Dosen Pembimbing</div>
            <div className="col-span-2 text-center">Aksi</div>
          </div>

          {/* Isi Tabel */}
          <div className="divide-y divide-[#eef4f8]">
            {filtered.map((row, idx) => (
              <div
                key={row.id}
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-[#F7F8F0]/30 transition"
              >
                {/* 1. No (1 Kolom) */}
                <div className="col-span-1 text-[#355872] font-semibold text-lg">
                  {idx + 1}
                </div>

                {/* 2. Mahasiswa (2 Kolom) */}
                <div className="col-span-2">
                  <div className="font-bold text-[#355872] text-lg">{row.nama}</div>
                  <div className="text-sm text-gray-500 font-medium mt-0.5">
                    NIM: 22720{row.id}0{row.id}
                  </div>
                </div>

                {/* 3. Topik/Badge (2 Kolom) */}
                <div className="col-span-2">
                  {row.jenisTopik === "dosen" ? (
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold whitespace-nowrap">
                      Topik Dosen
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold whitespace-nowrap">
                      Topik Mandiri
                    </span>
                  )}
                </div>

                {/* 4. Topik Pengajuan (3 Kolom) */}
                <div className="col-span-3 text-sm text-[#355872] font-medium pr-4">
                  {row.topik}
                </div>

                {/* 5. Dosen Pembimbing Status (2 Kolom) */}
                <div className="col-span-2">
                  {row.jenisTopik === "dosen" ? (
                    <p className="font-bold text-[#355872]">
                      {pembimbingLabel(row.pembimbingId)}
                    </p>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                      Menunggu Persetujuan
                    </span>
                  )}
                </div>

                {/* 6. Aksi Button (2 Kolom) */}
                <div className="col-span-2 flex justify-center gap-2">
                  <button
                    className="
                      px-4 py-2
                      rounded-xl
                      bg-red-50
                      text-red-600
                      border border-red-100
                      hover:bg-red-100
                      text-sm
                      font-bold
                      cursor-pointer
                      transition
                    "
                  >
                    Tolak
                  </button>

                  <button
                    onClick={() => {
                      if (row.jenisTopik === "mandiri") {
                        setActiveMahasiswa(row);
                        setTempDosenId(null);
                        setShowConfirm(false);
                      } else {
                        setToast("Topik berhasil disetujui.");
                        setTimeout(() => setToast(null), 2500);
                      }
                    }}
                    className="
                      px-4 py-2
                      rounded-xl
                      bg-[#355872]
                      text-white
                      hover:bg-[#2c475d]
                      text-sm
                      font-bold
                      cursor-pointer
                      transition
                    "
                  >
                    Setuju
                  </button>
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

        <DetailDosen
          activeMahasiswa={activeMahasiswa}
          tempDosenId={tempDosenId}
          showConfirm={showConfirm}
          dosenList={dosenList}
          onClose={() => setActiveMahasiswa(null)}
          onSelectDosen={setTempDosenId}
          onShowConfirm={setShowConfirm}
          onAssign={async () => {
            if (activeMahasiswa && tempDosenId !== null) {
              await handleAssign(activeMahasiswa.id, tempDosenId);
              setActiveMahasiswa(null);
            }
          }}
        />

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
