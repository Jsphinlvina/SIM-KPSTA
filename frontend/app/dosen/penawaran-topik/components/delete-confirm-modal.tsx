"use client";

import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative border border-[#e6eef5]">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle size={28} className="shrink-0" />
          <h2 className="text-2xl font-bold text-[#355872]">Hapus Penawaran Topik</h2>
        </div>
        
        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
          Apakah Anda yakin ingin menghapus topik penawaran Kerja Praktik ini secara permanen dari sistem? Mahasiswa tidak akan dapat melihat atau mendaftar untuk topik ini lagi. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#e6eef5]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-[#dbe9f4] text-gray-600 hover:bg-gray-50 transition font-semibold text-sm"
          >
            Batal
          </button>
          
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition font-semibold text-sm shadow-sm"
          >
            Hapus Permanen
          </button>
        </div>
      </div>
    </div>
  );
}
