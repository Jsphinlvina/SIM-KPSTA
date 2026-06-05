"use client";

import { X } from "lucide-react";

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

  const mahasiswa = [
    {
      nrp: "2272001",
      nama: "Jessica Luwia",
      topik: "Sistem Deteksi ASD",
    },
    {
      nrp: "2272010",
      nama: "Andi Saputra",
      topik: "Website Monitoring IoT",
    },
    {
      nrp: "2272020",
      nama: "Budi Hartono",
      topik: "AI untuk Edukasi",
    },
  ];

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
            <div>NRP</div>
            <div>Nama Mahasiswa</div>
            <div>Topik</div>
          </div>

          {mahasiswa.map((item, index) => (
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
              "
            >
              <div>{index + 1}</div>
              <div>{item.nrp}</div>
              <div>{item.nama}</div>
              <div>{item.topik}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}