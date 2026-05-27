"use client";

import Link from "next/link";
import { Upload, ArrowLeft } from "lucide-react";

export default function UploadLaporanPage() {
  const uploads = [
    {
      id: 1,
      title: "Laporan_KP_Revisi_2272004.pdf",
      status: "Done",
    },
    {
      id: 2,
      title: "Laporan_KP_2272004.pdf",
      status: "Butuh Revisi",
    },
  ];

  return (
    <div className="w-full py-10 flex flex-col">
      
      {/* Header */}
      <div className="flex items-start gap-4 mb-10">
        <Link 
          href="/mahasiswa" 
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
            Kirim Laporan 
          </h1>
          <p className="text-gray-500 mt-2">
            Kirim Laporan Kerja Praktik
          </p>
        </div>
      </div>

      {/* Card */}
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-[#e6eef5]
          shadow-sm
          p-8
        "
      >
        <div className="flex items-start justify-between mb-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#355872]">
              Website Monitoring IoT
            </h2>

            <p className="text-gray-600">
              Dosen Pembimbing : Budi Santoso, M.Kom
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <span className="text-gray-500">
              Topik dosen
            </span>

            <label
              className="
                flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-[#355872]
                hover:bg-[#7AAACE]
                text-white
                transition
                cursor-pointer
              "
            >
              <Upload size={18} />

              <span className="font-medium">
                Upload
              </span>

              <input
                type="file"
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Upload History */}
        <div className="space-y-5">
          {uploads.map((item) => (
            <div
              key={item.id}
              className="
                flex
                items-center
                justify-between
                bg-[#EAF4FB]
                border
                border-[#e6eef5]
                rounded-2xl
                px-6
                py-5
              "
            >
              <div className="flex items-center gap-6">
                <span
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-[#355872]
                    text-white
                    flex
                    items-center
                    justify-center
                    font-semibold
                  "
                >
                  {item.id}
                </span>

                <p className="text-[#355872] font-medium">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}