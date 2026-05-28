"use client";

import { useState } from "react";
import { X } from "lucide-react";
import api from "@/app/api";

interface ModalPengajuanMandiriProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function ModalPengajuanMandiri({
  open,
  onClose,
  onRefresh,
}: ModalPengajuanMandiriProps) {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmitMandiri = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!judul || !deskripsi) {
      alert("Judul dan deskripsi wajib diisi!");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post("/pengajuan/mandiri/", {
        judul_diajukan: judul,
        deskripsi_sistem: deskripsi,
      });

      if (res.data.success) {
        alert("Sukses membuat draf pengajuan mandiri!");
        setJudul("");
        setDeskripsi("");
        onRefresh(); 
        onClose(); 
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengirim pengajuan mandiri.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl relative">
        {/* Close */}
        <button onClick={onClose} className="absolute right-5 top-5 text-gray-400 hover:text-black">
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-[#355872] mb-6">
          Pengajuan Topik Mandiri
        </h2>

        <form onSubmit={handleSubmitMandiri} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#355872]">
              Judul Topik KP/STA Mandiri
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Input judul topik usulan Anda"
              className="w-full h-12 rounded-xl border border-[#355872] px-4 outline-none focus:ring-2 focus:ring-[#7AAACE]"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#355872]">
              Deskripsi Sistem / Gambaran Umum
            </label>
            <textarea
              rows={5}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan secara singkat fitur dan batasan sistem yang akan dikembangkan..."
              className="w-full rounded-2xl border border-[#355872] px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-[#7AAACE]"
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-[#dbe9f4] text-gray-600 hover:bg-gray-100"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#355872] hover:bg-[#7AAACE] text-white transition disabled:bg-gray-400"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Simpan Sebagai Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}