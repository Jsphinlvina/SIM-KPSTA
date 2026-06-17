"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import api from "../../api";

interface ProsesPenentuan {
  proses_id: number;
  status: string;
  tahap_chain: string;
  catatan_penolakan: string | null;
  pengajuan_detail: {
    judul_diajukan: string;
    deskripsi_sistem: string;
    mahasiswa_detail: { nama_lengkap: string; nim_nip: string };
    topik_detail?: { judul: string };
  } | null;
  dosen_detail: { nama_lengkap: string } | null;
}

export default function KelayakanPembimbingDosenPage() {
  const [list, setList] = useState<ProsesPenentuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [catatan, setCatatan] = useState("");
  const [detailItem, setDetailItem] = useState<ProsesPenentuan | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api.get("/bimbingan/pending-approval/")
      .then((res) => setList(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: number) => {
    setActionId(id);
    try {
      await api.post(`/bimbingan/${id}/check-approval/`, { reject: false });
      setList((prev) => prev.filter((p) => p.proses_id !== id));
      showToast("Kelayakan disetujui.", true);
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Gagal menyetujui.", false);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    setActionId(rejectId);
    try {
      await api.post(`/bimbingan/${rejectId}/check-approval/`, {
        reject: true,
        catatan: catatan || "Ditolak oleh dosen.",
      });
      setList((prev) => prev.filter((p) => p.proses_id !== rejectId));
      showToast("Kelayakan ditolak.", true);
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Gagal menolak.", false);
    } finally {
      setActionId(null);
      setRejectId(null);
      setCatatan("");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8F0]">
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <Link href="/dosen" className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872]">
            <ArrowLeft size={32} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">Kelayakan Pembimbing</h1>
            <p className="text-gray-500 mt-2">Permintaan kelayakan pembimbing yang menunggu persetujuan Anda</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-12 text-center text-gray-500">
            Tidak ada permintaan kelayakan yang menunggu.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm overflow-hidden">
            <div className="grid grid-cols-[60px_1fr_1fr_260px] bg-[#EAF4FB] px-8 py-5 font-semibold text-[#355872]">
              <div>No</div>
              <div>Mahasiswa</div>
              <div>Topik</div>
              <div>Aksi</div>
            </div>
            {list.map((item, idx) => (
              <div
                key={item.proses_id}
                className="grid grid-cols-[60px_1fr_1fr_260px] items-center px-8 py-6 border-t border-[#eef4f8]"
              >
                <div className="text-[#355872] font-medium">{idx + 1}</div>
                <div>
                  <p className="font-semibold text-[#355872]">
                    {item.pengajuan_detail?.mahasiswa_detail?.nama_lengkap ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.pengajuan_detail?.mahasiswa_detail?.nim_nip ?? "—"}
                  </p>
                </div>
                <div className="text-sm text-gray-700">
                  {item.pengajuan_detail?.topik_detail?.judul ?? "Topik Mandiri"}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDetailItem(item)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAF4FB] hover:bg-[#d4eaf7] text-[#355872] text-sm font-semibold transition cursor-pointer"
                  >
                    <FileText size={14} />
                    Detail
                  </button>
                  <button
                    onClick={() => handleApprove(item.proses_id)}
                    disabled={actionId === item.proses_id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition disabled:opacity-60 cursor-pointer"
                  >
                    {actionId === item.proses_id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Setuju
                  </button>
                  <button
                    onClick={() => setRejectId(item.proses_id)}
                    disabled={actionId === item.proses_id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-60 cursor-pointer"
                  >
                    <X size={14} />
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl relative">
            <button
              onClick={() => setDetailItem(null)}
              className="absolute right-5 top-5 text-gray-400 hover:text-black"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold text-[#355872] mb-4">Detail Pengajuan</h2>

            <div className="bg-[#EAF4FB] p-5 rounded-2xl border border-[#9CD5FF]/20 mb-6 space-y-3">
              <div>
                <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Judul Topik</span>
                <p className="font-bold text-[#355872] text-base leading-snug">
                  {detailItem.pengajuan_detail?.topik_detail?.judul
                    ?? detailItem.pengajuan_detail?.judul_diajukan
                    ?? "—"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#355872]/10">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Mahasiswa</span>
                  <p className="font-semibold text-gray-700 text-sm">
                    {detailItem.pengajuan_detail?.mahasiswa_detail?.nama_lengkap ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {detailItem.pengajuan_detail?.mahasiswa_detail?.nim_nip ?? "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Tipe Topik</span>
                  <p className="font-semibold text-gray-700 text-sm">
                    {detailItem.pengajuan_detail?.topik_detail ? "Topik Dosen" : "Topik Mandiri"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-[#355872]">
                Deskripsi Rencana & Ruang Lingkup Sistem
              </label>
              <textarea
                readOnly
                rows={5}
                value={detailItem.pengajuan_detail?.deskripsi_sistem ?? "—"}
                className="w-full rounded-2xl border border-[#355872]/20 px-4 py-3 resize-none text-gray-700 bg-gray-50 text-sm"
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setDetailItem(null)}
                className="px-6 py-2.5 rounded-full border border-[#dbe9f4] text-gray-600 hover:bg-gray-50 transition font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectId !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-[#355872] mb-4">Tolak Kelayakan</h2>
            <p className="text-gray-600 mb-4 text-sm">Berikan alasan penolakan (opsional):</p>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              placeholder="Alasan penolakan..."
              className="w-full rounded-xl border border-[#9CD5FF] px-4 py-3 outline-none focus:ring-2 focus:ring-[#7AAACE] resize-none text-sm mb-6"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setRejectId(null); setCatatan(""); }}
                className="px-5 py-2 rounded-xl border border-[#dbe9f4] text-gray-600 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={actionId !== null}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-60 flex items-center gap-2"
              >
                {actionId !== null && <Loader2 size={16} className="animate-spin" />}
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-10 z-50">
          <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg text-white text-sm font-medium ${toast.ok ? "bg-[#355872]" : "bg-red-500"}`}>
            {toast.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
