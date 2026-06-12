"use client";

import { useMemo, useState, useEffect } from "react";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DetailDosen from "./detail-dosen";
import { MahasiswaRowContext, runApprovalChain } from "./pembimbing-state";
import api from "../../api";
import { DistribusiDataManager } from "../distribusi-dosen/distribusi-data";

type Dosen = {
  id: number;
  nama: string;
};

export default function PenentuanDosenPembimbingPage() {
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeMahasiswa, setActiveMahasiswa] = useState<MahasiswaRowContext | null>(null);
  const [tempDosenId, setTempDosenId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [rows, setRows] = useState<MahasiswaRowContext[]>([]);
  const [nimsMap, setNimsMap] = useState<Record<number, string>>({});
  const [activePeriode, setActivePeriode] = useState<string | null>(null);

  useEffect(() => {
    api.get("/topik/periode-semester/active/")
      .then((res) => {
        if (res.data.success) setActivePeriode(res.data.data?.nama_periode ?? null);
      })
      .catch(() => setActivePeriode(null));

    const fetchAll = async () => {
      try {
        // Fetch submitted pengajuan and dosen list in parallel
        const [pengajuanRes, dosenRes] = await Promise.all([
          api.get("/pengajuan/"),
          api.get("/auth/dosen/"),
        ]);

        // Handle paginated or flat response
        const allPengajuan: any[] =
          pengajuanRes.data.data?.results ??
          pengajuanRes.data.data ??
          [];

        // Only show mandiri pengajuan (submitted, no topik, no proses started yet)
        const pending = allPengajuan.filter(
          (p: any) =>
            p.status_pengajuan === "submitted" &&
            !p.topik &&
            !p.has_proses
        );

        // Build nim map: pengajuan_kp_id → nim_nip
        const nims: Record<number, string> = {};
        const newRows = pending.map((p: any) => {
          nims[p.pengajuan_kp_id] = p.mahasiswa_detail?.nim_nip ?? "-";
          return new MahasiswaRowContext(
            p.pengajuan_kp_id,
            p.mahasiswa_detail?.nama_lengkap ?? "Mahasiswa",
            p.judul_diajukan ?? p.topik_detail?.judul ?? "-",
            p.topik ? "dosen" : "mandiri"
          );
        });

        setNimsMap(nims);
        setRows(newRows);

        const dosen: Dosen[] = (dosenRes.data.data || []).map((d: any) => ({
          id: d.user_id,
          nama: d.nama_lengkap,
        }));
        setDosenList(dosen);
      } catch (err) {
        console.error("Gagal memuat data penentuan pembimbing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.nama.toLowerCase().includes(q) || r.topik.toLowerCase().includes(q)
    );
  }, [query, rows]);

  const handleAssign = async (pengajuanId: number, dosenId: number) => {
    setSavingId(pengajuanId);
    try {
      // 1. Run Chain of Responsibility (frontend simulation)
      const targetRow = rows.find((r) => r.id === pengajuanId);
      if (targetRow) {
        const chainResult = runApprovalChain(
          targetRow.id,
          targetRow.nama,
          targetRow.topik,
          dosenId
        );
        console.log("Chain of Responsibility Logs:", chainResult.logs);
      }

      // 2. Start bimbingan chain (assigns supervisor, creates ProsesPenentuan at 'dosen' stage)
      await api.post(`/bimbingan/start-process/${pengajuanId}/`, {
        dosen_id: dosenId,
      });

      // 3. State transition (local)
      if (targetRow) {
        targetRow.assign(dosenId);
      }

      // 4. Update DistribusiDataManager Singleton
      try {
        const manager = DistribusiDataManager.getInstance();
        const dosenObj = dosenList.find((d) => d.id === dosenId);
        const mahasiswaRow = rows.find((r) => r.id === pengajuanId);
        if (dosenObj && mahasiswaRow) {
          manager.addMahasiswaToDosen(dosenObj.nama, mahasiswaRow.nama);
        }
      } catch (e) {
        console.warn("DistribusiDataManager update skipped:", e);
      }

      setRows([...rows]);
      setToast("Dosen pembimbing berhasil ditetapkan.");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal menetapkan pembimbing.";
      setToast(msg);
    } finally {
      setSavingId(null);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleTolak = async (pengajuanId: number) => {
    try {
      await api.post(`/pengajuan/${pengajuanId}/reject/`);
      setRows((prev) => prev.filter((r) => r.id !== pengajuanId));
      setToast("Pengajuan telah ditolak.");
      setTimeout(() => setToast(null), 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal menolak pengajuan.";
      setToast(msg);
      setTimeout(() => setToast(null), 2500);
    }
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
            className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872]"
          >
            <ArrowLeft size={32} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">
              Penentuan Dosen Pembimbing
            </h1>
            <p className="text-gray-500 mt-2">
              Tetapkan dosen pembimbing untuk mahasiswa yang mengajukan topik mandiri.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 bg-white rounded-xl border border-[#dbe9f4] text-[#355872] font-semibold text-sm shadow-sm">
          {activePeriode ?? "Tidak ada periode aktif"}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Memuat data...</div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 bg-[#EAF4FB] px-8 py-5 font-semibold text-[#355872] items-center">
            <div className="col-span-1">No</div>
            <div className="col-span-2">Mahasiswa</div>
            <div className="col-span-2">Topik</div>
            <div className="col-span-3">Topik Pengajuan</div>
            <div className="col-span-2">Dosen Pembimbing</div>
            <div className="col-span-2 text-center">Aksi</div>
          </div>

          <div className="divide-y divide-[#eef4f8]">
            {filtered.map((row, idx) => (
              <div
                key={row.id}
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-[#F7F8F0]/30 transition"
              >
                <div className="col-span-1 text-[#355872] font-semibold text-lg">{idx + 1}</div>

                <div className="col-span-2">
                  <div className="font-bold text-[#355872] text-lg">{row.nama}</div>
                  <div className="text-sm text-gray-500 font-medium mt-0.5">
                    NIM: {nimsMap[row.id] ?? "-"}
                  </div>
                </div>

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

                <div className="col-span-3 text-sm text-[#355872] font-medium pr-4">
                  {row.topik}
                </div>

                <div className="col-span-2">
                  {row.pembimbingId ? (
                    <p className="font-bold text-[#355872]">{pembimbingLabel(row.pembimbingId)}</p>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase">
                      {row.getStatus()}
                    </span>
                  )}
                </div>

                <div className="col-span-2 flex justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleTolak(row.id)}
                    disabled={!!row.pembimbingId || savingId === row.id}
                    className="px-3 py-2 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold cursor-pointer transition"
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
                        setToast("Pembimbing sudah ditetapkan.");
                        setTimeout(() => setToast(null), 2500);
                      }
                    }}
                    disabled={savingId === row.id}
                    className="px-4 py-2 rounded-xl bg-[#355872] text-white hover:bg-[#2c475d] disabled:opacity-60 disabled:cursor-not-allowed text-sm font-bold cursor-pointer transition"
                  >
                    {savingId === row.id ? "..." : "Setuju"}
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500 font-medium">
                Tidak ada pengajuan yang menunggu penentuan pembimbing.
              </div>
            )}
          </div>
        </div>
      )}

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

      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-10 z-50">
          <div className="bg-[#355872] text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
