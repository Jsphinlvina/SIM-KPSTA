"use client";

import { AlertCircle } from "lucide-react";

interface EditConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  kuota: string;
  deskripsi: string;
}

export default function EditConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  kuota,
  deskripsi,
}: EditConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl relative border border-[#e6eef5]">
        <div className="flex items-center gap-3 text-[#355872] mb-4">
          <AlertCircle size={28} className="shrink-0 text-[#355872]" />
          <h2 className="text-2xl font-bold text-[#355872]">Konfirmasi Edit Topik</h2>
        </div>

        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
          Apakah Anda yakin ingin menyimpan seluruh perubahan pada topik Kerja Praktik ini? Perubahan akan langsung diperbarui di dashboard mahasiswa.
        </p>

        <div className="bg-[#EAF4FB] p-5 rounded-2xl border border-[#9CD5FF]/20 mb-6 space-y-3">
          <div>
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Judul Topik Baru</span>
            <p className="font-bold text-[#355872] text-base leading-snug">{title}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-[#355872]/10">
            <div>
              <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Kuota Baru</span>
              <p className="font-semibold text-gray-600 text-sm">{kuota} Mahasiswa</p>
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Kategori</span>
              <p className="font-semibold text-gray-600 text-sm">Kerja Praktik</p>
            </div>
          </div>
          <div className="pt-2.5 border-t border-[#355872]/10">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Deskripsi Rencana Baru</span>
            <p className="text-gray-600 text-xs font-medium leading-relaxed line-clamp-2 mt-0.5">{deskripsi}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#e6eef5]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-[#dbe9f4] text-gray-600 hover:bg-gray-50 transition font-semibold text-sm"
          >
            Batal
          </button>
          
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-full bg-[#355872] hover:bg-[#7AAACE] text-white transition font-semibold text-sm shadow-sm"
          >
            Ya, Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
