"use client";

import { X } from "lucide-react";

interface ModalPengajuanMandiriProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalPengajuanMandiri({
  open,
  onClose,
}: ModalPengajuanMandiriProps) {
  if (!open) return null;

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
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl relative">
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

        <h2 className="text-2xl font-bold text-[#355872] mb-8">
          Pengajuan Topik Mandiri
        </h2>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-[#355872]">
                Judul Topik
              </label>

              <input
                type="text"
                placeholder="Input judul topik"
                className="
                  w-full
                  h-12
                  rounded-xl
                  border
                  border-[#355872]
                  px-4
                  outline-none
                  focus:ring-2
                  focus:ring-[#7AAACE]
                "
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-[#355872]">
                Nama Dosen
              </label>

              <input
                type="text"
                placeholder="Nama dosen"
                className="
                  w-full
                  h-12
                  rounded-xl
                  border
                  border-[#355872]
                  px-4
                  outline-none
                  focus:ring-2
                  focus:ring-[#7AAACE]
                "
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#355872]">
              Deskripsi
            </label>

            <textarea
              rows={5}
              placeholder="Input deskripsi"
              className="
                w-full
                rounded-2xl
                border
                border-[#355872]
                px-4
                py-3
                outline-none
                resize-none
                focus:ring-2
                focus:ring-[#7AAACE]
              "
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="
                px-5
                py-2
                rounded-full
                border
                border-[#dbe9f4]
                text-gray-600
                hover:bg-gray-100
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-5
                py-2
                rounded-full
                bg-[#355872]
                hover:bg-[#7AAACE]
                text-white
                transition
              "
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}