"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, X, Loader2 } from "lucide-react";
import api from "../../api";

interface Dosen {
  id: number;
  nama: string;
}

interface MahasiswaRow {
  id: number;
  nama: string;
  nim: string;
  topik: string;
  pembimbingId?: number;
}

export default function PenentuanDosenPembimbingPage() {
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [rows, setRows] = useState<MahasiswaRow[]>([]);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [loading, setLoading] = useState(true);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [pengRes, dosenRes] = await Promise.all([
          api.get("/pengajuan/"),
          api.get("/auth/dosen/"),
        ]);
        const pengList: any[] = pengRes.data.data?.results ?? pengRes.data.data ?? [];
        setRows(
          pengList
            .filter((p: any) => p.status_pengajuan === "approved")
            .map((p: any) => ({
              id: p.pengajuan_kp_id,
              nama: p.mahasiswa_detail?.nama_lengkap ?? "—",
              nim: p.mahasiswa_detail?.nim_nip ?? "—",
              topik: p.topik_detail?.judul ?? p.judul_diajukan ?? "—",
              pembimbingId: undefined,
            }))
        );
        setDosenList(
          (dosenRes.data.data || []).map((d: any) => ({
            id: d.user_id,
            nama: d.nama_lengkap,
          }))
        );
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.nama.toLowerCase().includes(q) || r.topik.toLowerCase().includes(q)
    );
  }, [query, rows]);

  const handleAssign = async (rowId: number, dosenId: number) => {
    setSavingId(rowId);
    try {
      await api.post(`/bimbingan/start-process/${rowId}/`, { dosen_id: dosenId });
      setRows((prev) =>
        prev.map((row) => row.id === rowId ? { ...row, pembimbingId: dosenId } : row)
      );
      showToast("Dosen pembimbing berhasil ditetapkan.");
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Gagal menetapkan dosen.");
    } finally {
      setSavingId(null);
    }
  };

  const pembimbingLabel = (pembimbingId?: number) => {
    if (!pembimbingId) return "Belum ditetapkan";
    return dosenList.find((d) => d.id === pembimbingId)?.nama ?? "—";
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0]">
      <div className="p-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#355872]">Penentuan Dosen Pembimbing</h1>
            <p className="text-gray-500 mt-2">Tetapkan dosen pembimbing untuk mahasiswa yang pengajuannya disetujui.</p>
          </div>
          <div className="text-[#355872] font-medium">Admin</div>
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
            {query.trim() && (
              <button onClick={() => setQuery("")} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 cursor-pointer">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] overflow-hidden">
            <div className="grid grid-cols-5 bg-[#EAF4FB] px-6 py-5 font-semibold text-[#355872]">
              <div>No</div>
              <div className="col-span-2">Mahasiswa</div>
              <div>Topik</div>
              <div>Pembimbing</div>
            </div>

            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">Tidak ada data.</div>
            ) : (
              filtered.map((row, idx) => (
                <div key={row.id} className="grid grid-cols-5 px-6 py-5 items-center border-t border-[#eef4f8]">
                  <div className="text-[#355872] font-medium">{idx + 1}</div>
                  <div className="col-span-2">
                    <div className="font-semibold text-[#355872]">{row.nama}</div>
                    <div className="text-sm text-gray-400">{row.nim}</div>
                  </div>
                  <div className="text-sm text-gray-700">{row.topik}</div>
                  <div className="flex flex-col gap-2">
                    <div className="text-xs text-gray-500">{pembimbingLabel(row.pembimbingId)}</div>
                    <div className="flex gap-2">
                      <select
                        disabled={savingId === row.id}
                        value={row.pembimbingId ?? ""}
                        onChange={(e) => {
                          const nextId = Number(e.target.value);
                          if (!nextId) return;
                          handleAssign(row.id, nextId);
                        }}
                        className="flex-1 h-10 rounded-xl border border-[#9CD5FF] px-3 outline-none focus:ring-2 focus:ring-[#7AAACE] bg-white text-sm disabled:opacity-70"
                      >
                        <option value="" disabled>Pilih dosen</option>
                        {dosenList.map((d) => (
                          <option key={d.id} value={d.id}>{d.nama}</option>
                        ))}
                      </select>
                      <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] flex items-center justify-center">
                        {row.pembimbingId ? (
                          <CheckCircle2 size={18} className="text-green-600" />
                        ) : savingId === row.id ? (
                          <Loader2 size={16} className="animate-spin text-[#355872]" />
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-10 z-50">
            <div className="bg-[#355872] text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">{toast}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
