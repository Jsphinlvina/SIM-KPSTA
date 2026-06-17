"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, BookOpen, AlertCircle, Edit, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/app/api";

interface Topik {
  id: number;
  judul: string;
  kuota: number;
  deskripsi: string;
}

export default function KoordinatorTopikPage() {
  const [profile, setProfile] = useState<any>(null);
  const [topikList, setTopikList] = useState<Topik[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [judul, setJudul] = useState("");
  const [kuota, setKuota] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Edit modal
  const [editItem, setEditItem] = useState<Topik | null>(null);
  const [editJudul, setEditJudul] = useState("");
  const [editKuota, setEditKuota] = useState("");
  const [editDeskripsi, setEditDeskripsi] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete confirm
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toStr = (raw: unknown): string => {
    if (typeof raw === "string") return raw;
    if (raw && typeof raw === "object") return String(Object.values(raw)[0]);
    return "Terjadi kesalahan.";
  };

  const fetchTopik = (userId: number) => {
    api.get(`/topik/by-dosen/${userId}/`)
      .then((res) => {
        if (res.data.success) {
          setTopikList(
            res.data.data.map((t: any) => ({
              id: t.topik_id,
              judul: t.judul,
              kuota: t.kuota,
              deskripsi: t.deskripsi,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get("/auth/me/")
      .then((res) => {
        if (res.data.success) {
          setProfile(res.data.data);
          fetchTopik(res.data.data.user_id);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsedKuota = Number(kuota);
    if (!judul.trim() || !deskripsi.trim()) {
      setFormError("Judul dan deskripsi wajib diisi.");
      return;
    }
    if (!Number.isFinite(parsedKuota) || parsedKuota <= 0) {
      setFormError("Kuota harus berupa angka positif.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.post("/topik/", {
        judul: judul.trim(),
        deskripsi: deskripsi.trim(),
        kuota: parsedKuota,
        prasyarat: "Kerja Praktik",
      });
      if (res.data.success) {
        const t = res.data.data;
        setTopikList((prev) => [...prev, { id: t.topik_id, judul: t.judul, kuota: t.kuota, deskripsi: t.deskripsi }]);
        setJudul(""); setKuota(""); setDeskripsi("");
        showToast("Topik berhasil ditambahkan.", "success");
      }
    } catch (err: any) {
      const msg = toStr(err.response?.data?.message);
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (t: Topik) => {
    setEditItem(t);
    setEditJudul(t.judul);
    setEditKuota(String(t.kuota));
    setEditDeskripsi(t.deskripsi);
    setEditError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    setEditError(null);
    const parsedKuota = Number(editKuota);
    if (!editJudul.trim() || !editDeskripsi.trim()) {
      setEditError("Judul dan deskripsi wajib diisi.");
      return;
    }
    if (!Number.isFinite(parsedKuota) || parsedKuota <= 0) {
      setEditError("Kuota harus berupa angka positif.");
      return;
    }
    setEditSaving(true);
    try {
      const res = await api.put(`/topik/${editItem.id}/`, {
        judul: editJudul.trim(),
        deskripsi: editDeskripsi.trim(),
        kuota: parsedKuota,
        prasyarat: "Kerja Praktik",
      });
      if (res.data.success) {
        const t = res.data.data;
        setTopikList((prev) =>
          prev.map((x) => x.id === editItem.id ? { id: t.topik_id, judul: t.judul, kuota: t.kuota, deskripsi: t.deskripsi } : x)
        );
        setEditItem(null);
        showToast("Topik berhasil diperbarui.", "success");
      }
    } catch (err: any) {
      setEditError(toStr(err.response?.data?.message));
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    const id = deletingId;
    setDeletingId(null);
    try {
      await api.delete(`/topik/${id}/`);
      setTopikList((prev) => prev.filter((t) => t.id !== id));
      showToast("Topik berhasil dihapus.", "success");
    } catch (err: any) {
      showToast(toStr(err.response?.data?.message), "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8F0]">
      <div className="flex-1 p-10 flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <Link href="/koordinator" className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872]">
            <ArrowLeft size={32} />
          </Link>
          <div className="flex-1 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#355872]">Kelola Topik KP</h1>
              <p className="text-gray-500 mt-2 font-medium">
                Buat dan kelola topik Kerja Praktik yang Anda tawarkan kepada mahasiswa
              </p>
            </div>
            <div className="text-[#355872] font-bold bg-[#EAF4FB] px-5 py-3 rounded-2xl border border-[#9CD5FF]/20 shadow-sm text-sm">
              Koordinator: <span className="text-gray-600 ml-1 font-semibold">{profile?.nama_lengkap ?? "Memuat..."}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8 w-full">
          {/* Add Form */}
          <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#355872]">Tambah Topik Penawaran</h2>
              <p className="text-xs text-gray-400 mt-1 font-medium">Siarkan topik baru untuk Kerja Praktik (KP)</p>
            </div>

            <form onSubmit={handleAdd} className="space-y-6">
              {formError && (
                <div className="bg-red-50 text-red-700 text-sm p-4 rounded-2xl border border-red-100 font-medium flex items-start gap-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-9">
                  <label className="block text-sm font-semibold text-[#355872] mb-2">Judul Topik Kerja Praktik</label>
                  <input
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Rancang Bangun Sistem Manajemen KP Berbasis Web"
                    className="w-full h-12 px-4 rounded-xl border border-[#355872]/20 bg-white outline-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-medium placeholder:text-gray-400 transition"
                  />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className="block text-sm font-semibold text-[#355872] mb-2">Kuota (Mahasiswa)</label>
                  <input
                    value={kuota}
                    onChange={(e) => setKuota(e.target.value)}
                    type="number"
                    min={1}
                    placeholder="Contoh: 3"
                    className="w-full h-12 px-4 rounded-xl border border-[#355872]/20 bg-white outline-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-semibold placeholder:text-gray-400 transition"
                  />
                </div>
                <div className="col-span-12">
                  <label className="block text-sm font-semibold text-[#355872] mb-2">Deskripsi Rencana KP</label>
                  <textarea
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    rows={4}
                    placeholder="Tuliskan deskripsi lengkap, batasan sistem, dan teknologi yang digunakan..."
                    className="w-full px-4 py-3 rounded-2xl border border-[#355872]/20 bg-white outline-none resize-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-medium placeholder:text-gray-400 transition"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e6eef5]">
                <button
                  type="button"
                  onClick={() => { setJudul(""); setKuota(""); setDeskripsi(""); setFormError(null); }}
                  className="px-6 py-2.5 rounded-full bg-white border border-[#dbe9f4] text-[#355872] font-semibold hover:bg-gray-50 transition text-sm"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-[#355872] hover:bg-[#7AAACE] text-white font-bold transition disabled:opacity-60 flex items-center gap-2 shadow-sm text-sm"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} />}
                  {saving ? "Menyimpan..." : "Tambah Topik"}
                </button>
              </div>
            </form>
          </div>

          {/* Topik List */}
          <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#355872]">Daftar Topik Saya</h2>
              <p className="text-xs text-gray-400 mt-1 font-medium">Semua topik KP yang sedang Anda tawarkan kepada mahasiswa</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12 text-gray-400">
                <Loader2 size={28} className="animate-spin" />
              </div>
            ) : topikList.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-[#e6eef5] rounded-3xl">
                <BookOpen size={48} className="text-gray-300 mb-3" />
                <h4 className="font-bold text-[#355872] text-lg">Belum Ada Topik</h4>
                <p className="text-sm text-gray-400 mt-1 max-w-sm font-medium">
                  Tambahkan topik KP di atas untuk mulai menawarkan ke mahasiswa.
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[460px] pr-2 border border-[#eef4f8] rounded-2xl shadow-inner">
                <div className="divide-y divide-[#eef4f8]">
                  {topikList.map((t) => (
                    <div key={t.id} className="bg-white p-6 hover:bg-[#F7F8F0]/30 transition flex items-start justify-between gap-6">
                      <div className="space-y-2.5 flex-1">
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                          Kuota: {t.kuota} Mahasiswa
                        </span>
                        <h3 className="font-bold text-[#355872] text-xl leading-snug">{t.judul}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">{t.deskripsi}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 mt-1">
                        <button
                          onClick={() => openEdit(t)}
                          className="p-3 text-[#355872] hover:text-[#7AAACE] hover:bg-[#EAF4FB] rounded-xl transition"
                          title="Edit"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => setDeletingId(t.id)}
                          className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                          title="Hapus"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-[#e6eef5]">
            <h2 className="text-xl font-bold text-[#355872] mb-6">Edit Topik</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              {editError && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl border border-red-100 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{editError}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-[#355872] mb-1.5">Judul Topik</label>
                <input
                  value={editJudul}
                  onChange={(e) => setEditJudul(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-[#355872]/20 bg-white outline-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-medium transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#355872] mb-1.5">Kuota</label>
                <input
                  value={editKuota}
                  onChange={(e) => setEditKuota(e.target.value)}
                  type="number"
                  min={1}
                  className="w-full h-11 px-4 rounded-xl border border-[#355872]/20 bg-white outline-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-semibold transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#355872] mb-1.5">Deskripsi</label>
                <textarea
                  value={editDeskripsi}
                  onChange={(e) => setEditDeskripsi(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-[#355872]/20 bg-white outline-none resize-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-medium transition"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#e6eef5]">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-6 py-2.5 rounded-full border border-[#dbe9f4] text-gray-600 hover:bg-gray-50 transition font-semibold text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-6 py-2.5 rounded-full bg-[#355872] hover:bg-[#7AAACE] text-white font-bold transition disabled:opacity-60 flex items-center gap-2 text-sm"
                >
                  {editSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                  {editSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl border border-[#fce8e6] text-center">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Trash2 size={28} />
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Hapus Topik?</h2>
            <p className="text-gray-500 text-sm font-medium mb-6">
              Topik ini akan dihapus secara permanen dan tidak dapat dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-full border border-[#dbe9f4] text-[#355872] font-semibold hover:bg-gray-50 transition text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition text-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl shadow-lg font-semibold text-sm text-white transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
