"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X, Archive, RotateCcw, Trash2, Loader2, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import api from "../../api";

interface ArchiveRecord {
  id: number;
  source_type: string;
  source_id: number;
  title: string;
  student_id: number | null;
  lecturer_id: number | null;
  state: string;
  created_at: string;
}

const STATE_LABEL: Record<string, string> = {
  active: "Aktif",
  archived: "Diarsipkan",
  deleted: "Dihapus",
};

const STATE_CLASS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  archived: "bg-yellow-100 text-yellow-700",
  deleted: "bg-red-100 text-red-600",
};

export default function ArsipPage() {
  const [records, setRecords] = useState<ArchiveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api.get("/archive/")
      .then((res) => setRecords(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearching(true);
      api.get("/archive/")
        .then((res) => setRecords(res.data.data || []))
        .catch(() => {})
        .finally(() => setSearching(false));
      return;
    }
    setSearching(true);
    try {
      const res = await api.get(`/archive/search/?keyword=${encodeURIComponent(query)}`);
      setRecords(res.data.data || []);
    } catch (_) {
    } finally {
      setSearching(false);
    }
  };

  const handleArchive = async (id: number) => {
    setActionId(id);
    try {
      const res = await api.post(`/archive/${id}/archive/`);
      setRecords((prev) => prev.map((r) => r.id === id ? res.data.data : r));
      showToast("Arsip berhasil diarsipkan.", true);
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Gagal mengarsipkan.", false);
    } finally {
      setActionId(null);
    }
  };

  const handleRestore = async (id: number) => {
    setActionId(id);
    try {
      const res = await api.post(`/archive/${id}/restore/`);
      setRecords((prev) => prev.map((r) => r.id === id ? res.data.data : r));
      showToast("Arsip berhasil dipulihkan.", true);
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Gagal memulihkan.", false);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setActionId(id);
    try {
      await api.delete(`/archive/${id}/`);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showToast("Arsip dihapus.", true);
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Gagal menghapus.", false);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8F0]">
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <Link href="/koordinator" className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872]">
              <ArrowLeft size={32} />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-[#355872]">Arsip</h1>
              <p className="text-gray-500 mt-2">Kelola arsip dokumen dan jadwal bimbingan</p>
            </div>
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
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Cari arsip berdasarkan judul..."
              className="flex-1 h-11 rounded-xl border border-[#9CD5FF] px-4 outline-none focus:ring-2 focus:ring-[#7AAACE]"
            />
            {query && (
              <button onClick={() => { setQuery(""); handleSearch(); }} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            )}
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-5 py-2.5 rounded-xl bg-[#355872] hover:bg-[#7AAACE] text-white font-semibold text-sm transition disabled:opacity-60 cursor-pointer"
            >
              {searching ? <Loader2 size={16} className="animate-spin" /> : "Cari"}
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm overflow-hidden">
            <div className="grid grid-cols-[60px_1fr_120px_120px_200px] bg-[#EAF4FB] px-8 py-5 font-semibold text-[#355872]">
              <div>No</div>
              <div>Judul</div>
              <div>Tipe</div>
              <div>Status</div>
              <div>Aksi</div>
            </div>

            {records.length === 0 ? (
              <div className="px-8 py-12 text-center text-gray-500">Tidak ada arsip ditemukan.</div>
            ) : (
              records.map((rec, idx) => (
                <div
                  key={rec.id}
                  className="grid grid-cols-[60px_1fr_120px_120px_200px] items-center px-8 py-5 border-t border-[#eef4f8]"
                >
                  <div className="text-[#355872] font-medium">{idx + 1}</div>
                  <div>
                    <p className="font-medium text-[#355872]">{rec.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(rec.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#EAF4FB] text-[#355872] text-xs font-semibold capitalize">
                      {rec.source_type}
                    </span>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATE_CLASS[rec.state] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATE_LABEL[rec.state] ?? rec.state}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {rec.state === "active" && (
                      <button
                        onClick={() => handleArchive(rec.id)}
                        disabled={actionId === rec.id}
                        title="Arsipkan"
                        className="w-9 h-9 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center transition disabled:opacity-60 cursor-pointer"
                      >
                        {actionId === rec.id ? <Loader2 size={14} className="animate-spin" /> : <Archive size={14} />}
                      </button>
                    )}
                    {rec.state === "archived" && (
                      <button
                        onClick={() => handleRestore(rec.id)}
                        disabled={actionId === rec.id}
                        title="Pulihkan"
                        className="w-9 h-9 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition disabled:opacity-60 cursor-pointer"
                      >
                        {actionId === rec.id ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(rec.id)}
                      disabled={actionId === rec.id}
                      title="Hapus"
                      className="w-9 h-9 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition disabled:opacity-60 cursor-pointer"
                    >
                      {actionId === rec.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

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
