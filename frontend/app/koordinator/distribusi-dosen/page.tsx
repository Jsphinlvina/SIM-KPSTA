"use client";

import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import DetailMahasiswa from "./detail-mahasiswa";
import { DistribusiDataManager, DosenDistribusi, IDistribusiObserver } from "./distribusi-data";

export default function DistribusiDosenPage() {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState("");
  const [dosenList, setDosenList] = useState<DosenDistribusi[]>([]);

  useEffect(() => {
    const manager = DistribusiDataManager.getInstance();
    setDosenList([...manager.getDistribusiData()]);

    // Concrete Observer
    const observer: IDistribusiObserver = {
      onDistribusiChanged(updatedData) {
        setDosenList([...updatedData]);
      },
    };

    manager.registerObserver(observer);

    return () => {
      manager.removeObserver(observer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8F0] p-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-start gap-4">
          <Link
            href="/koordinator"
            className="
              mt-1
              p-2
              rounded-full
              hover:bg-[#EAF4FB]
              transition
              text-[#355872]
            "
          >
            <ArrowLeft size={32} />
          </Link>

          <div>
            <h1 className="text-4xl font-bold text-[#355872]">
              Distribusi Dosen
            </h1>

            <p className="text-gray-500 mt-2">
              Monitoring jumlah mahasiswa yang dibimbing oleh setiap dosen.
            </p>
          </div>
        </div>

        <div
          className="
            px-5
            py-3
            bg-white
            rounded-xl
            border
            border-[#dbe9f4]
            text-[#355872]
            font-semibold
            text-sm
            shadow-sm
          "
        >
          Genap 2025/2026
        </div>
      </div>

      {/* Table */}
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-[#dbe9f4]
          overflow-hidden
          shadow-sm
        "
      >
        {/* Header */}
        <div
          className="
            grid
            grid-cols-[100px_1fr_250px_150px]
            bg-[#EAF4FB]
            px-8
            py-5
            font-semibold
            text-[#355872]
          "
        >
          <div>No</div>
          <div>Nama Dosen</div>
          <div>Jumlah Mahasiswa</div>
          <div>Aksi</div>
        </div>

        {/* Body */}
        {dosenList.map((dosen, index) => (
          <div
            key={dosen.id}
            className="
              grid
              grid-cols-[100px_1fr_250px_150px]
              items-center
              px-8
              py-6
              border-t
              border-[#eef4f8]
            "
          >
            <div className="font-medium text-[#355872]">
              {index + 1}
            </div>

            <div className="font-medium text-[#355872]">
              {dosen.nama}
            </div>

            <div>
              <span
                className="
                  px-4
                  py-2
                  rounded-full
                  bg-[#EAF4FB]
                  text-[#355872]
                  font-medium
                "
              >
                {dosen.jumlahMahasiswa} Mahasiswa
              </span>
            </div>

            <div>
              <button
                onClick={() => {
                  setSelectedDosen(dosen.nama);
                  setOpenDetail(true);
                }}
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-[#355872]
                  hover:bg-[#7AAACE]
                  text-white
                  flex
                  items-center
                  justify-center
                  transition
                  cursor-pointer
                "
              >
                <Eye size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Mahasiswa */}
      <DetailMahasiswa
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        namaDosen={selectedDosen}
      />
    </div>
  );
}