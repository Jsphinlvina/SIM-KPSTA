"use client";

import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function SuccessModal({
  open,
  onClose,
  title,
  message,
}: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative border border-[#eef4f8] text-center flex flex-col items-center">
        {/* Dynamic Success Check Indicator */}
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-5 border border-green-100">
          <CheckCircle2 size={36} />
        </div>

        <h2 className="text-2xl font-bold text-[#355872] mb-3">
          {title}
        </h2>
        
        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6 px-2">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#355872] hover:bg-[#7AAACE] text-white transition font-bold text-sm shadow-md"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
