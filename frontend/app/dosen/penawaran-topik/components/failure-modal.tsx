"use client";

import { XOctagon } from "lucide-react";

interface FailureModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function FailureModal({
  open,
  onClose,
  title,
  message,
}: FailureModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative border border-[#fce8e6] text-center flex flex-col items-center">
        {/* Dynamic Failure Error Indicator */}
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-5 border border-red-100">
          <XOctagon size={36} />
        </div>

        <h2 className="text-2xl font-bold text-red-800 mb-3">
          {title}
        </h2>
        
        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6 px-2">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition font-bold text-sm shadow-md"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
