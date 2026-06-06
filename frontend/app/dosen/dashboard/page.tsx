"use client";

import { useEffect, useState } from "react";
import { Users, Clock, BookOpen, CheckCircle2, ArrowLeft } from "lucide-react";
import api from "@/app/api";
import Link from "next/link";
import { DashboardDataManager, Student } from "./dashboard-data";

/**
 * Singleton Pattern (FE):
 * Data mahasiswa diambil dari DashboardDataManager.getInstance()
 * bukan di-hardcode ulang tiap render, sehingga satu sumber data
 * konsisten di seluruh sesi tanpa re-fetch berulang.
 */

export default function DashboardDosenPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [dosenProfile, setDosenProfile] = useState<any>(null);

  // Ambil data dari Singleton — satu instance, konsisten di seluruh sesi
  const manager = DashboardDataManager.getInstance();

  // Fetch profil dosen
  useEffect(() => {
    api.get("/auth/me/")
      .then((res) => {
        if (res.data.success) {
          setDosenProfile(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat profil dosen:", err);
      });
  }, []);

  // Load data dari Singleton
  useEffect(() => {
    setStudents(manager.getStudents());
  }, []);

  const activeCount = manager.getActiveCount();
  const pendingCount = manager.getPendingCount();

  return (
    <div className="p-10 flex flex-col w-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <Link
              href="/admin"
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
              <h1 className="text-3xl font-bold text-[#355872]">
                Dashboard Dosen
              </h1>
              <p className="text-gray-500 mt-2 font-medium">
                Pemantauan beban dan status bimbingan mahasiswa Kerja Praktik
              </p>
            </div>
          </div>

          <div className="text-[#355872] font-bold bg-[#EAF4FB] px-5 py-3 rounded-2xl border border-[#9CD5FF]/20 shadow-sm text-sm">
            Dosen Pembimbing: <span className="text-gray-600 ml-1 font-semibold">{dosenProfile ? dosenProfile.nama_lengkap : "Memuat..."}</span>
          </div>
        </div>


        {/* Statistics Cards Row */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {/* Card 1: Total Students */}
          <div className="bg-white rounded-3xl p-6 border border-[#e6eef5] shadow-sm flex items-center gap-5">
            <div className="p-4 bg-[#EAF4FB] text-[#355872] rounded-2xl">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Bimbingan</p>
              <h3 className="text-3xl font-bold text-[#355872] mt-1">{students.length}</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Mahasiswa di bawah asuhan</p>
            </div>
          </div>

          {/* Card 2: Active */}
          <div className="bg-white rounded-3xl p-6 border border-[#e6eef5] shadow-sm flex items-center gap-5">
            <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Bimbingan Aktif</p>
              <h3 className="text-3xl font-bold text-green-700 mt-1">{activeCount}</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Mahasiswa status aktif</p>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-white rounded-3xl p-6 border border-[#e6eef5] shadow-sm flex items-center gap-5">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Persetujuan Pending</p>
              <h3 className="text-3xl font-bold text-amber-700 mt-1">{pendingCount}</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Butuh respon persetujuan</p>
            </div>
          </div>
        </div>

        {/* Main Monitoring Card Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] overflow-hidden flex-1">
          <div className="px-8 py-6 border-b border-[#f0f5fa]">
            <h2 className="text-xl font-bold text-[#355872]">
              Daftar Mahasiswa Bimbingan
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Gunakan daftar di bawah untuk memantau progres tugas serta kelengkapan administratif.
            </p>
          </div>

          {/* Table Grid */}
          <div className="grid grid-cols-12 gap-4 bg-[#EAF4FB] px-8 py-4 font-semibold text-[#355872] border-b border-[#e6eef5] text-sm">
            <div className="col-span-1">No</div>
            <div className="col-span-3">Mahasiswa</div>
            <div className="col-span-4">Topik Kerja Praktik</div>
            <div className="col-span-2">Progres Laporan</div>
            <div className="col-span-2 text-right pr-2">Status</div>
          </div>

          <div className="divide-y divide-[#eef4f8]">
            {students.map((student, i) => (
              <div
                key={student.id}
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-[#F7F8F0]/30 transition"
              >
                {/* 1. Index */}
                <div className="col-span-1 text-[#355872] font-semibold text-lg">
                  {i + 1}
                </div>

                {/* 2. Student */}
                <div className="col-span-3">
                  <p className="font-bold text-[#355872] text-lg">{student.name}</p>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">NIM: {student.nim}</p>
                </div>

                {/* 3. Topic */}
                <div className="col-span-4 text-sm text-[#355872] font-medium pr-6 leading-relaxed">
                  {student.topic}
                </div>

                {/* 4. Progress Bar */}
                <div className="col-span-2 pr-6">
                  <div className="flex items-center justify-between text-xs font-bold text-[#355872] mb-1.5">
                    <span>Progres</span>
                    <span>{student.progress}%</span>
                  </div>
                  <div className="w-full bg-[#EAF4FB] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        student.progress > 50
                          ? "bg-green-500"
                          : student.progress > 20
                          ? "bg-[#355872]"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* 5. Status Badge */}
                <div className="col-span-2 flex items-center justify-end pr-2">
                  {student.status === "Aktif" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}