"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import api from "../../api";

interface Defense {
  id: number;
  student_id: number;
  lecturer_id: number;
  coordinator_id: number;
  bimbingan_aktif_id: number;
  date: string;
  time: string;
  location: string;
  meeting_link: string;
  notes: string;
  status: string;
}

interface DosenOption {
  user_id: number;
  nama_lengkap: string;
  nim_nip: string;
}

interface BimbinganOption {
  bimbingan_id: number;
  mahasiswa_detail: { user_id: number; nama_lengkap: string; nim_nip: string };
  dosen_detail: { user_id: number; nama_lengkap: string };
}

const STATUS_CLASS: Record<string, string> = {
  scheduled: "bg-yellow-100 text-yellow-700",
  ongoing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Terjadwal",
  ongoing: "Berlangsung",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const EMPTY_FORM = {
  bimbingan_aktif_id: "",
  lecturer_id: "",
  student_id: "",
  coordinator_id: "",
  date: "",
  time: "",
  location: "",
  meeting_link: "",
  notes: "",
};

export default function JadwalSidangPage() {
  const [defenses, setDefenses] = useState<Defense[]>([]);
  const [bimbinganList, setBimbinganList] = useState<BimbinganOption[]>([]);
  const [dosenList, setDosenList] = useState<DosenOption[]>([]);
  const [koordinatorId, setKoordinatorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [defRes, bimRes, dosenRes, meRes] = await Promise.all([
          api.get("/defense/"),
          api.get("/bimbingan/"),
          api.get("/auth/dosen/"),
          api.get("/auth/me/"),
        ]);
        setDefenses(defRes.data.data || []);
        setBimbinganList(bimRes.data.data?.results ?? bimRes.data.data ?? []);
        setDosenList(dosenRes.data.data || []);
        setKoordinatorId(meRes.data.data?.user_id ?? null);
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM, coordinator_id: String(koordinatorId ?? "") });
    setShowModal(true);
  };

  const openEdit = (d: Defense) => {
    setEditId(d.id);
    setForm({
      bimbingan_aktif_id: String(d.bimbingan_aktif_id),
      lecturer_id: String(d.lecturer_id),
      student_id: String(d.student_id),
      coordinator_id: String(d.coordinator_id),
      date: d.date,
      time: d.time?.slice(0, 5) ?? "",
      location: d.location ?? "",
      meeting_link: d.meeting_link ?? "",
      notes: d.notes ?? "",
    });
    setShowModal(true);
  };

  const handleBimbinganChange = (bimId: string) => {
    const bim = bimbinganList.find((b) => String(b.bimbingan_id) === bimId);
    setForm((prev) => ({
      ...prev,
      bimbingan_aktif_id: bimId,
      student_id: bim ? String(bim.mahasiswa_detail?.user_id ?? "") : "",
      lecturer_id: bim ? String(bim.dosen_detail?.user_id ?? "") : "",
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      bimbingan_aktif_id: Number(form.bimbingan_aktif_id),
      lecturer_id: Number(form.lecturer_id),
      student_id: Number(form.student_id),
      coordinator_id: Number(form.coordinator_id),
      date: form.date,
      time: form.time,
      location: form.location,
      meeting_link: form.meeting_link,
      notes: form.notes,
    };
    try {
      if (editId !== null) {
        const res = await api.put(`/defense/${editId}/`, payload);
        setDefenses((prev) => prev.map((d) => d.id === editId ? res.data.data : d));
        showToast("Jadwal sidang diperbarui.", true);
      } else {
        const res = await api.post("/defense/", payload);
        setDefenses((prev) => [res.data.data, ...prev]);
        showToast("Jadwal sidang dibuat.", true);
      }
      setShowModal(false);
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Gagal menyimpan jadwal.", false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setActionId(id);
    try {
      await api.delete(`/defense/${id}/`);
      setDefenses((prev) => prev.filter((d) => d.id !== id));
      showToast("Jadwal sidang dibatalkan.", true);
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
              <h1 className="text-4xl font-bold text-[#355872]">Jadwal Sidang</h1>
              <p className="text-gray-500 mt-2">Kelola jadwal sidang/defense mahasiswa KP</p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#355872] hover:bg-[#7AAACE] text-white font-semibold text-sm transition cursor-pointer"
          >
            <Plus size={18} />
            Buat Jadwal
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm overflow-hidden">
            <div className="grid grid-cols-[60px_1fr_160px_160px_140px_120px] bg-[#EAF4FB] px-8 py-5 font-semibold text-[#355872]">
              <div>No</div>
              <div>Tanggal & Tempat</div>
              <div>Mahasiswa</div>
              <div>Dosen</div>
              <div>Status</div>
              <div>Aksi</div>
            </div>
            {defenses.length === 0 ? (
              <div className="px-8 py-12 text-center text-gray-500">Belum ada jadwal sidang.</div>
            ) : (
              defenses.map((d, idx) => {
                const bim = bimbinganList.find((b) => b.bimbingan_id === d.bimbingan_aktif_id);
                return (
                  <div
                    key={d.id}
                    className="grid grid-cols-[60px_1fr_160px_160px_140px_120px] items-center px-8 py-5 border-t border-[#eef4f8]"
                  >
                    <div className="text-[#355872] font-medium">{idx + 1}</div>
                    <div>
                      <p className="font-semibold text-[#355872]">
                        {new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <p className="text-xs text-gray-400">{d.time?.slice(0, 5)} — {d.location || "Online"}</p>
                    </div>
                    <div className="text-sm text-gray-700">
                      {bim?.mahasiswa_detail?.nama_lengkap ?? `ID: ${d.student_id}`}
                    </div>
                    <div className="text-sm text-gray-700">
                      {bim?.dosen_detail?.nama_lengkap ?? `ID: ${d.lecturer_id}`}
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CLASS[d.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABEL[d.status] ?? d.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(d)}
                        className="w-9 h-9 rounded-xl bg-[#355872] hover:bg-[#7AAACE] text-white flex items-center justify-center transition cursor-pointer"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        disabled={actionId === d.id}
                        className="w-9 h-9 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition disabled:opacity-60 cursor-pointer"
                      >
                        {actionId === d.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#355872]">
                {editId ? "Edit Jadwal Sidang" : "Buat Jadwal Sidang"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#355872] mb-1">Bimbingan</label>
                <select
                  value={form.bimbingan_aktif_id}
                  onChange={(e) => handleBimbinganChange(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#9CD5FF] px-4 outline-none focus:ring-2 focus:ring-[#7AAACE] bg-white text-sm"
                >
                  <option value="">— Pilih Bimbingan —</option>
                  {bimbinganList.map((b) => (
                    <option key={b.bimbingan_id} value={b.bimbingan_id}>
                      {b.mahasiswa_detail?.nama_lengkap ?? `Bimbingan #${b.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#355872] mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full h-11 rounded-xl border border-[#9CD5FF] px-4 outline-none focus:ring-2 focus:ring-[#7AAACE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#355872] mb-1">Jam</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                    className="w-full h-11 rounded-xl border border-[#9CD5FF] px-4 outline-none focus:ring-2 focus:ring-[#7AAACE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#355872] mb-1">Lokasi</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="Ruang sidang / Online"
                  className="w-full h-11 rounded-xl border border-[#9CD5FF] px-4 outline-none focus:ring-2 focus:ring-[#7AAACE]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#355872] mb-1">Link Meeting (opsional)</label>
                <input
                  type="text"
                  value={form.meeting_link}
                  onChange={(e) => setForm((p) => ({ ...p, meeting_link: e.target.value }))}
                  placeholder="https://meet.google.com/..."
                  className="w-full h-11 rounded-xl border border-[#9CD5FF] px-4 outline-none focus:ring-2 focus:ring-[#7AAACE]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#355872] mb-1">Catatan (opsional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  className="w-full rounded-xl border border-[#9CD5FF] px-4 py-3 outline-none focus:ring-2 focus:ring-[#7AAACE] resize-none text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl border border-[#dbe9f4] text-gray-600 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.bimbingan_aktif_id || !form.date || !form.time}
                className="px-5 py-2 rounded-xl bg-[#355872] hover:bg-[#7AAACE] text-white transition disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Simpan
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
