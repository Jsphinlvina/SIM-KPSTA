"use client";

import Sidebar from "@/app/components/sidebar";
import { useEffect, useState } from "react";

type Student = {
  id: number;
  name: string;
  topic: string;
  status: string;
};

export default function DashboardDosenPage() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    setStudents([
      {
        id: 1,
        name: "Andi Saputra",
        topic: "Sistem Informasi KP",
        status: "Aktif",
      },
      {
        id: 2,
        name: "Budi Hartono",
        topic: "AI untuk Edukasi",
        status: "Pending",
      },
      {
        id: 3,
        name: "Citra Lestari",
        topic: "Web Monitoring KP",
        status: "Aktif",
      },
    ]);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F7F8F0]">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#355872]">
              Dashboard Dosen
            </h1>

            <p className="text-gray-500 mt-2">
              Monitoring mahasiswa bimbingan
            </p>
          </div>

          <div className="text-[#355872] font-medium">
            Dosen :
            <span className="ml-2 text-gray-600">
              Budi Santoso, S.Kom, M.T
            </span>
          </div>
        </div>

        {/* Card utama */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] p-8">
          {/* Summary */}
          <div className="mb-8">
            <div className="bg-[#EAF4FB] rounded-2xl px-6 py-5 w-fit">
              <p className="text-sm text-gray-500">
                Total Mahasiswa Bimbingan
              </p>
              <p className="text-2xl font-bold text-[#355872]">
                {students.length}
              </p>
            </div>
          </div>

          {/* List mahasiswa */}
          <div>
            <h2 className="text-xl font-bold text-[#355872] mb-6">
              Daftar Mahasiswa
            </h2>

            <div className="space-y-3">
              {students.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-[#e6eef5]"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-[#355872]">
                      {i + 1}.
                    </span>

                    <div>
                      <p className="font-medium text-[#355872]">
                        {s.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {s.topic}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      s.status === "Aktif"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}