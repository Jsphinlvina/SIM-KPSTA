"use client";

import { X } from "lucide-react";
import { DistribusiDataManager } from "./distribusi-data";

interface DetailMahasiswaProps {
  open: boolean;
  onClose: () => void;
  namaDosen: string;
}

export default function DetailMahasiswa({
  open,
  onClose,
  namaDosen,
}: DetailMahasiswaProps) {
  if (!open) return null;

  // Membaca data terbaru dari Singleton manager
  const manager = DistribusiDataManager.getInstance();
  const targetDosen = manager.getDistribusiData().find(
    (d) => d.nama.toLowerCase().includes(namaDosen.toLowerCase()) || 
           namaDosen.toLowerCase().includes(d.nama.toLowerCase())
  );

  const mahasiswaList = targetDosen ? targetDosen.mahasiswaList : [];

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/30
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          w-[900px]
          bg-white
          rounded-3xl
          shadow-xl
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            flex
            justify-between
            items-center
            px-8
            py-5
            border-b
          "
        >
          <div>
            <h2 className="text-2xl font-bold text-[#355872]">
              Mahasiswa Bimbingan
            </h2>

            <p className="text-gray-500 mt-1">
              {namaDosen}
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              p-2
              rounded-xl
              hover:bg-gray-100
              text-[#355872]
              cursor-pointer
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Table */}
        <div className="max-h-[500px] overflow-auto">
          <div
            className="
              grid
              grid-cols-[100px_180px_1fr_1.5fr]
              bg-[#EAF4FB]
              px-8
              py-4
              font-semibold
              text-[#355872]
            "
          >
            <div>No</div>
            <div>NIM / NRP</div>
            <div>Nama Mahasiswa</div>
            <div>Topik Bimbingan</div>
          </div>

          {mahasiswaList.map((mName, index) => (
            <div
              key={index}
              className="
                grid
                grid-cols-[100px_180px_1fr_1.5fr]
                px-8
                py-5
                border-b
                border-[#eef4f8]
                text-[#355872]
                items-center
              "
            >
              <div>{index + 1}</div>
              <div>22720{index + 1}1</div>
              <div className="font-bold">{mName}</div>
              <div className="text-sm text-gray-500 font-medium">Sistem Informasi Pengajuan KP/STA</div>
            </div>
          ))}

          {mahasiswaList.length === 0 && (
            <div className="px-8 py-10 text-center text-gray-500 font-medium">
              Belum ada mahasiswa bimbingan yang terdaftar untuk dosen ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}