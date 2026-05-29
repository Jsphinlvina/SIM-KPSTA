"use client";

import { X } from "lucide-react";

interface ModalAddProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalAdd({
  openModal,
  setOpenModal,
}: ModalAddProps) {
  if (!openModal) return null;

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
      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-3xl
          p-8
          shadow-2xl
          relative
        "
      >
        {/* Close */}
        <button
          onClick={() => setOpenModal(false)}
          className="
            absolute
            right-5
            top-5
            text-gray-400
            hover:text-black
            cursor-pointer
          "
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#355872] mb-8">
          Add User
        </h2>

        {/* Form */}
        <form className="space-y-6">
          {/* Nama */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#355872]">
              Nama
            </label>

            <input
              type="text"
              placeholder="Input nama user"
              className="
                w-full
                h-12
                rounded-xl
                border
                border-[#9CD5FF]
                px-4
                outline-none
                focus:ring-2
                focus:ring-[#7AAACE]
                text-[#355872]
              "
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#355872]">
              Role
            </label>

            <select
              className="
                w-full
                h-12
                rounded-xl
                border
                border-[#9CD5FF]
                px-4
                outline-none
                focus:ring-2
                focus:ring-[#7AAACE]
                bg-white
                text-[#355872]
              "
            >
              <option>Mahasiswa</option>
              <option>Dosen</option>
              <option>Admin</option>
            </select>
          </div>

          {/* Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="
                px-5
                py-2
                rounded-xl
                border
                border-[#dbe9f4]
                text-gray-600
                hover:bg-gray-100
                cursor-pointer
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-5
                py-2
                rounded-xl
                bg-[#355872]
                hover:bg-[#7AAACE]
                text-white
                transition
                cursor-pointer
              "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}