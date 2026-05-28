"use client";

import { useState } from "react";
import { X } from "lucide-react";
import api from "@/app/api";

interface ModalPengajuanMandiriProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ModalPengajuanMandiri({
  open,
  onClose,
  onSuccess,
}: ModalPengajuanMandiriProps) {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !deskripsi.trim()) {
      setErrorMsg("Judul dan deskripsi wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await api.post("/pengajuan/", {
        judul_diajukan: judul.trim(),
        deskripsi_sistem: deskripsi.trim(),
      });

      if (response.data.success) {
        setJudul("");
        setDeskripsi("");
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Gagal mengirim pengajuan mandiri.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            text-gray-400
            hover:text-black
          "
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-[#355872] mb-6">
          Pengajuan Topik Mandiri
        </h2>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-sm p-4 rounded-2xl border border-red-100 mb-6 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#355872]">
              Rencana Judul Kerja Praktik
            </label>

            <input
              type="text"
              placeholder="Contoh: Rancang Bangun Aplikasi E-Commerce UMKM Desa"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="
                w-full
                h-12
                rounded-xl
                border
                border-[#355872]/30
                px-4
                outline-none
                focus:border-[#355872]
                focus:ring-2
                focus:ring-[#355872]/20
                text-gray-700
                placeholder:text-gray-400
                transition
              "
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-[#355872]">
              Deskripsi Rencana Sistem
            </label>

            <textarea
              rows={5}
              placeholder="Jelaskan secara singkat ruang lingkup sistem yang akan Anda bangun..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="
                w-full
                rounded-2xl
                border
                border-[#355872]/30
                px-4
                py-3
                outline-none
                resize-none
                focus:border-[#355872]
                focus:ring-2
                focus:ring-[#355872]/20
                text-gray-700
                placeholder:text-gray-400
                transition
              "
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#e6eef5]">
            <button
              type="button"
              onClick={onClose}
              className="
                px-6
                py-2.5
                rounded-full
                border
                border-[#dbe9f4]
                text-gray-600
                hover:bg-gray-50
                transition
                font-medium
              "
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                px-6
                py-2.5
                rounded-full
                bg-[#355872]
                hover:bg-[#7AAACE]
                text-white
                transition
                font-medium
                disabled:opacity-50
              "
            >
              {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}