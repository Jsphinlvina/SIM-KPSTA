"use client";

import { useMemo, useState, useEffect } from "react";
import { CheckCircle2, X, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DetailDosen from "./detail-dosen";
import { MahasiswaRowContext, runApprovalChain } from "./pembimbing-state";

type Dosen = {
  id: number;
  nama: string;
};

export default function PenentuanDosenPembimbingPage() {
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [activeMahasiswa, setActiveMahasiswa] = useState<MahasiswaRowContext | null>(null);
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

  // Initialize using MahasiswaRowContext class (State Pattern Context)
  const [rows, setRows] = useState<MahasiswaRowContext[]>([]);

  useEffect(() => {
    setRows([
      new MahasiswaRowContext(1, "Andi Saputra", "Sistem Informasi KP", "dosen", 1),
      new MahasiswaRowContext(2, "Budi Hartono", "AI untuk Edukasi", "mandiri"),
      new MahasiswaRowContext(3, "Citra Lestari", "Web Monitoring KP", "dosen", 2),
    ]);
  }, []);

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

    // 1. Run Chain of Responsibility
    const targetRow = rows.find((r) => r.id === mahasiswaId);
    if (targetRow) {
      const chainResult = runApprovalChain(
        targetRow.id,
        targetRow.nama,
        targetRow.topik,
        dosenId
      );
      console.log("Chain of Responsibility Logs:", chainResult.logs);

      // 2. Perform State transition using State Pattern
      targetRow.assign(dosenId);

      // 3. Update Singleton Distribusi if available
      // (Akan dihubungkan di Task 3)
      try {
        const { DistribusiDataManager } = require("../distribusi-dosen/distribusi-data");
        const manager = DistribusiDataManager.getInstance();
        const dosenObj = dosenList.find(d => d.id === dosenId);
        if (dosenObj) {
          manager.addMahasiswaToDosen(dosenObj.nama, targetRow.nama);
        }
      } catch (e) {
        console.warn("DistribusiDataManager belum diinisialisasi");
      }
    }

    setRows([...rows]);
    setSavingId(null);
    setToast("Berhasil menetapkan dosen pembimbing.");
    setTimeout(() => setToast(null), 2500);
  };

  const pembimbingLabel = (pembimbingId?: number) => {
    if (!pembimbingId) return "Belum ditetapkan";
    return dosenList.find((d) => d.id === pembimbingId)?.nama ?? "";
  };

  return (
    <div className="p-10 w-full">
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
            font-semibold
            text-sm
            shadow-sm
          "
        >
          Genap 2025/2026
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] overflow-hidden">
        {/* Header Tabel */}
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
              {/* 1. No */}
              <div className="col-span-1 text-[#355872] font-semibold text-lg">
                {idx + 1}
              </div>

              {/* 2. Mahasiswa */}
              <div className="col-span-2">
                <div className="font-bold text-[#355872] text-lg">{row.nama}</div>
                <div className="text-sm text-gray-500 font-medium mt-0.5">
                  NIM: 22720{row.id}0{row.id}
                </div>
              </div>

              {/* 3. Topik/Badge */}
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

              {/* 4. Topik Pengajuan */}
              <div className="col-span-3 text-sm text-[#355872] font-medium pr-4">
                {row.topik}
              </div>

              {/* 5. Dosen Pembimbing Status */}
              <div className="col-span-2">
                {row.pembimbingId ? (
                  <p className="font-bold text-[#355872]">
                    {pembimbingLabel(row.pembimbingId)}
                  </p>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase">
                    {row.getStatus()}
                  </span>
                )}
              </div>

              {/* 6. Aksi Button */}
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
                    if (!row.pembimbingId) {
                      setActiveMahasiswa(row);
                      setTempDosenId(null);
                      setShowConfirm(false);
                    } else {
                      setToast("Topik sudah disetujui sebelumnya.");
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
        activeMahasiswa={activeMahasiswa as any}
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
  );
}
