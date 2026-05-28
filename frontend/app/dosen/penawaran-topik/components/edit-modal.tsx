"use client";

import { useState, useEffect } from "react";
import { X, Edit2 } from "lucide-react";

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (judul: string, kuota: string, deskripsi: string) => void;
  initialJudul: string;
  initialKuota: string;
  initialDeskripsi: string;
}

export default function EditModal({
  open,
  onClose,
  onSave,
  initialJudul,
  initialKuota,
  initialDeskripsi,
}: EditModalProps) {
  const [judul, setJudul] = useState("");
  const [kuota, setKuota] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setJudul(initialJudul);
      setKuota(initialKuota);
      setDeskripsi(initialDeskripsi);
      setErrorMsg(null);
    }
  }, [open, initialJudul, initialKuota, initialDeskripsi]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedKuota = Number(kuota);

    if (!judul.trim() || !deskripsi.trim()) {
      setErrorMsg("Judul topik dan deskripsi rencana bimbingan wajib diisi.");
      return;
    }
    if (!Number.isFinite(parsedKuota) || parsedKuota <= 0) {
      setErrorMsg("Kuota bimbingan harus diisi dengan angka positif lebih dari 0.");
      return;
    }

    setErrorMsg(null);
    onSave(judul.trim(), kuota, deskripsi.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-45 animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl relative border border-[#eef4f8]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-black transition"
        >
          <X size={22} />
        </button>

        <div className="flex items-center gap-3 text-[#355872] mb-6">
          <Edit2 size={24} className="text-[#355872]" />
          <h2 className="text-2xl font-bold text-[#355872]">Edit Penawaran Topik</h2>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-sm p-4 rounded-2xl border border-red-100 font-medium mb-6">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-12 gap-5">
            {/* Judul Topik */}
            <div className="col-span-12 md:col-span-9">
              <label className="block text-sm font-semibold text-[#355872] mb-2">Judul Topik Kerja Praktik</label>
              <input
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Rancang Bangun Sistem Smart Grid Berbasis IoT"
                className="w-full h-12 px-4 rounded-xl border border-[#355872]/20 bg-white outline-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-medium transition"
              />
            </div>

            {/* Kuota */}
            <div className="col-span-12 md:col-span-3">
              <label className="block text-sm font-semibold text-[#355872] mb-2">Kuota (Mhs)</label>
              <input
                value={kuota}
                onChange={(e) => setKuota(e.target.value)}
                type="number"
                min={1}
                placeholder="Contoh: 3"
                className="w-full h-12 px-4 rounded-xl border border-[#355872]/20 bg-white outline-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-semibold transition"
              />
            </div>

            {/* Deskripsi */}
            <div className="col-span-12">
              <label className="block text-sm font-semibold text-[#355872] mb-2">Deskripsi Rencana Kerja Praktik</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={4}
                placeholder="Tuliskan deskripsi lengkap, batasan sistem, dan teknologi utama..."
                className="w-full px-4 py-3 rounded-2xl border border-[#355872]/20 bg-white outline-none resize-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-medium transition"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#e6eef5]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border border-[#dbe9f4] text-gray-600 hover:bg-gray-50 transition font-semibold text-sm"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#355872] hover:bg-[#7AAACE] text-white transition font-bold text-sm shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
