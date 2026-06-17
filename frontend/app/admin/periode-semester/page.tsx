"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X, Loader2, AlertTriangle } from "lucide-react";
import api from "../../api";

interface Periode {
  periode_semester_id: number;
  nama_periode: string;
  status_periode: boolean;
}

type ModalType =
  | { type: "create" }
  | { type: "edit"; periode: Periode }
  | { type: "activate"; periode: Periode }
  | { type: "deactivate"; periode: Periode }
  | { type: "delete"; periode: Periode };

export default function PeriodeSemesterPage() {
  const [periodes, setPeriodes] = useState<Periode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType | null>(null);
  const [formSemester, setFormSemester] = useState<"Ganjil" | "Genap">("Ganjil");
  const [formYear, setFormYear] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const buildNamaPeriode = (semester: string, year: string) => {
    const start = parseInt(year, 10);
    return `${semester} ${start}/${start + 1}`;
  };

  const parseNamaPeriode = (nama: string) => {
    const match = nama.match(/^(Ganjil|Genap)\s+(\d{4})/);
    return {
      semester: (match?.[1] ?? "Ganjil") as "Ganjil" | "Genap",
      year: match?.[2] ?? "",
    };
  };

  const fetchPeriodes = () => {
    api.get("/topik/periode-semester/")
      .then((res) => setPeriodes(res.data.results ?? res.data.data ?? res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPeriodes(); }, []);

  const openCreate = () => {
    setFormSemester("Ganjil");
    setFormYear(String(new Date().getFullYear()));
    setErrorMsg("");
    setModal({ type: "create" });
  };

  const openEdit = (periode: Periode) => {
    const { semester, year } = parseNamaPeriode(periode.nama_periode);
    setFormSemester(semester);
    setFormYear(year);
    setErrorMsg("");
    setModal({ type: "edit", periode });
  };

  const closeModal = () => {
    setModal(null);
    setErrorMsg("");
  };

  const handleCreateOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const yearNum = parseInt(formYear, 10);
    if (!formYear || isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      setErrorMsg("Masukkan tahun yang valid (contoh: 2025).");
      return;
    }
    const namaPeriode = buildNamaPeriode(formSemester, formYear);
    setSubmitting(true);
    setErrorMsg("");
    try {
      if (modal?.type === "create") {
        await api.post("/topik/periode-semester/", { nama_periode: namaPeriode });
      } else if (modal?.type === "edit") {
        await api.put(`/topik/periode-semester/${modal.periode.periode_semester_id}/`, { nama_periode: namaPeriode });
      }
      closeModal();
      fetchPeriodes();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message ?? "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivate = async () => {
    if (modal?.type !== "activate") return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await api.post(`/topik/periode-semester/${modal.periode.periode_semester_id}/activate/`);
      closeModal();
      fetchPeriodes();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message ?? "Gagal mengaktifkan periode.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (modal?.type !== "deactivate") return;
    setSubmitting(true);
    try {
      await api.post(`/topik/periode-semester/${modal.periode.periode_semester_id}/deactivate/`);
      closeModal();
      fetchPeriodes();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message ?? "Gagal menonaktifkan periode.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (modal?.type !== "delete") return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await api.delete(`/topik/periode-semester/${modal.periode.periode_semester_id}/`);
      closeModal();
      fetchPeriodes();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message ?? "Gagal menghapus periode.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0]">
      <div className="p-10 flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">Periode Semester</h1>
            <p className="text-gray-500 mt-2">Kelola periode semester aktif sistem</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 h-12 rounded-full bg-[#355872] hover:bg-[#7AAACE] text-white font-semibold transition shadow-sm"
          >
            <Plus size={18} />
            Tambah Periode
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-[#e6eef5] overflow-hidden shadow-sm">
          <div className="grid grid-cols-[60px_1fr_180px_200px] bg-[#EAF4FB] px-8 py-5 font-semibold text-[#355872]">
            <div>No</div>
            <div>Nama Periode</div>
            <div>Status</div>
            <div>Aksi</div>
          </div>

          {loading ? (
            <div className="py-14 flex justify-center text-gray-400">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : periodes.length === 0 ? (
            <div className="py-12 text-center text-gray-500">Belum ada periode semester.</div>
          ) : (
            periodes.map((periode, index) => (
              <div
                key={periode.periode_semester_id}
                className="grid grid-cols-[60px_1fr_180px_200px] items-center px-8 py-5 border-t border-[#eef4f8]"
              >
                <div className="text-[#355872]">{index + 1}</div>
                <div className="font-medium text-[#355872]">{periode.nama_periode}</div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    periode.status_periode === true
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {periode.status_periode === true ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <div className="flex gap-2">
                  {/* Activate / Deactivate */}
                  {periode.status_periode === false ? (
                    <button
                      onClick={() => setModal({ type: "activate", periode })}
                      title="Aktifkan"
                      className="w-10 h-10 rounded-xl bg-green-600 hover:bg-green-500 text-white flex items-center justify-center transition"
                    >
                      <Check size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setModal({ type: "deactivate", periode })}
                      title="Nonaktifkan"
                      className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center transition"
                    >
                      <X size={16} />
                    </button>
                  )}
                  {/* Edit */}
                  <button
                    onClick={() => openEdit(periode)}
                    title="Edit Nama"
                    className="w-10 h-10 rounded-xl bg-[#355872] hover:bg-[#7AAACE] text-white flex items-center justify-center transition"
                  >
                    <Pencil size={16} />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => { setErrorMsg(""); setModal({ type: "delete", periode }); }}
                    title="Hapus"
                    className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── MODALS ── */}

      {/* Create / Edit modal */}
      {(modal?.type === "create" || modal?.type === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8">
            <h2 className="text-lg font-bold text-[#355872] mb-6">
              {modal.type === "create" ? "Tambah Periode Semester" : "Edit Nama Periode"}
            </h2>
            <form onSubmit={handleCreateOrEdit} className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-[#355872] mb-2">Semester</label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value as "Ganjil" | "Genap")}
                    className="w-full h-11 px-4 rounded-xl border border-[#dbe9f4] text-[#355872] outline-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/20 transition text-sm bg-white"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-[#355872] mb-2">Tahun Mulai</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="2025"
                    min={2000}
                    max={2100}
                    className="w-full h-11 px-4 rounded-xl border border-[#dbe9f4] text-[#355872] outline-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/20 transition text-sm"
                  />
                </div>
              </div>
              {formYear && !isNaN(parseInt(formYear, 10)) && (
                <div className="px-4 py-2.5 rounded-xl bg-[#EAF4FB] text-[#355872] text-sm">
                  Nama periode: <span className="font-semibold">{buildNamaPeriode(formSemester, formYear)}</span>
                </div>
              )}
              {errorMsg && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {errorMsg}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-[#d9e6f0] text-[#355872] hover:bg-[#EAF4FB] transition text-sm font-medium">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-[#355872] hover:bg-[#7AAACE] disabled:opacity-60 text-white text-sm font-medium transition flex items-center gap-2">
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {modal.type === "create" ? "Simpan" : "Perbarui"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activate modal */}
      {modal?.type === "activate" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <Check size={22} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#355872]">Aktifkan Periode</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Aktifkan <span className="font-semibold text-[#355872]">{modal.periode.nama_periode}</span>?
                  Pastikan tidak ada periode lain yang sedang aktif.
                </p>
              </div>
            </div>
            {errorMsg && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                {errorMsg}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-[#d9e6f0] text-[#355872] hover:bg-[#EAF4FB] transition text-sm font-medium">Batal</button>
              <button onClick={handleActivate} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-medium transition flex items-center gap-2">
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Ya, Aktifkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate modal */}
      {modal?.type === "deactivate" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={22} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#355872]">Nonaktifkan Periode</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Nonaktifkan <span className="font-semibold text-[#355872]">{modal.periode.nama_periode}</span>?
                  Dosen tidak dapat menawarkan topik sementara tidak ada periode aktif.
                </p>
              </div>
            </div>
            {errorMsg && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{errorMsg}</div>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-[#d9e6f0] text-[#355872] hover:bg-[#EAF4FB] transition text-sm font-medium">Batal</button>
              <button onClick={handleDeactivate} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white text-sm font-medium transition flex items-center gap-2">
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Ya, Nonaktifkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {modal?.type === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#355872]">Hapus Periode</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Hapus <span className="font-semibold text-[#355872]">{modal.periode.nama_periode}</span>?
                  Periode hanya dapat dihapus jika tidak ada topik yang terkait.
                </p>
              </div>
            </div>
            {errorMsg && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                {errorMsg}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-[#d9e6f0] text-[#355872] hover:bg-[#EAF4FB] transition text-sm font-medium">Batal</button>
              <button onClick={handleDelete} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white text-sm font-medium transition flex items-center gap-2">
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
