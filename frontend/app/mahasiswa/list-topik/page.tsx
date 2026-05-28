"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ModalPengajuanMandiri from "./modal-pengajuan-mandiri";
import api from "@/app/api"; 

interface TopikDosen {
  topik_id: number;
  judul: string;
  deskripsi: string;
  kuota: number;
  user_detail?: {
    nama_lengkap: string;
  };
}

interface RiwayatPengajuan {
  pengajuan_kp_id: number;
  judul_diajukan: string;
  status_pengajuan: string;
  topik_detail?: {
    user_detail?: {
      nama_lengkap: string;
    };
  };
}

export default function ListTopikPage() {
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("topik");
  const [topics, setTopics] = useState<TopikDosen[]>([]);
  const [riwayat, setRiwayat] = useState<RiwayatPengajuan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTopikDosen = async () => {
    try {
      setLoading(true);
      const res = await api.get("/topik/available/");
      if (res.data.success) {
        setTopics(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil topik dosen:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiwayatSaya = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pengajuan/my/");
      if (res.data.success) {
        setRiwayat(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil riwayat pengajuan:", err);
    } {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "topik") {
      fetchTopikDosen();
    } else if (activeTab === "riwayat") {
      fetchRiwayatSaya();
    }
  }, [activeTab]);

  const handleAjukanTopikDosen = async (topikId: number) => {
    if (!confirm("Apakah Anda yakin ingin mengajukan draf untuk topik dosen ini?")) return;
    try {
      const res = await api.post("/pengajuan/topik-dosen/", { topik: topikId });
      if (res.data.success) {
        alert(res.data.message || "Draft pengajuan berhasil dibuat!");
        setActiveTab("riwayat"); 
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal memproses pengajuan.");
    }
  };

  return (
    <div className="w-full py-10 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <Link href="/mahasiswa" className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872]">
            <ArrowLeft size={32} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">Daftar Topik</h1>
            <p className="text-gray-500 mt-2">
              {activeTab === "topik" ? "Daftar Topik Dosen" : "Daftar Riwayat Pengajuan"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="px-6 h-12 rounded-full bg-[#355872] hover:bg-[#7AAACE] text-white font-medium transition shadow-md"
        >
          Pengajuan Topik Mandiri +
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 mb-8 border-b border-[#dbe9f4]">
        <button
          onClick={() => setActiveTab("topik")}
          className={`pb-3 text-sm font-semibold transition border-b-2 ${
            activeTab === "topik" ? "border-[#355872] text-[#355872]" : "border-transparent text-gray-500 hover:text-[#355872]"
          }`}
        >
          Topik Dosen
        </button>

        <button
          onClick={() => setActiveTab("riwayat")}
          className={`pb-3 text-sm font-semibold transition border-b-2 ${
            activeTab === "riwayat" ? "border-[#355872] text-[#355872]" : "border-transparent text-gray-500 hover:text-[#355872]"
          }`}
        >
          Riwayat Pengajuan
        </button>
      </div>

      {loading && <p className="text-center text-[#355872] my-4 font-medium animate-pulse">Memuat data dari server...</p>}

      {/* TOPIK DOSEN */}
      {activeTab === "topik" && !loading && (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#e6eef5]">
          <table className="w-full">
            <thead className="bg-[#EAF4FB]">
              <tr className="text-left text-[#355872]">
                <th className="px-6 py-4">Judul Topik</th>
                <th className="px-6 py-4">Nama Dosen</th>
                <th className="px-6 py-4">Kuota Sisa</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {topics.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">Tidak ada penawaran topik aktif saat ini.</td></tr>
              ) : (
                topics.map((item) => (
                  <tr key={item.topik_id} className="border-t border-[#eef4f8]">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-[#355872] text-lg">{item.judul}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.deskripsi}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700">{item.user_detail?.nama_lengkap || "Dosen Pengampu"}</td>
                    <td className="px-6 py-5 text-gray-700">{item.kuota}</td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleAjukanTopikDosen(item.topik_id)}
                        className="px-4 py-2 rounded-full bg-[#355872] hover:bg-[#7AAACE] text-white text-sm transition"
                      >
                        Ajukan
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* RIWAYAT PENGAJUAN */}
      {activeTab === "riwayat" && !loading && (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#e6eef5]">
          <table className="w-full">
            <thead className="bg-[#EAF4FB]">
              <tr className="text-left text-[#355872]">
                <th className="px-6 py-4">Judul Diajukan</th>
                <th className="px-6 py-4">Dosen Pembimbing / Jalur</th>
                <th className="px-6 py-4">Status Transisi</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-8 text-gray-400">Anda belum pernah mengajukan judul apa pun.</td></tr>
              ) : (
                riwayat.map((item) => (
                  <tr key={item.pengajuan_kp_id} className="border-t border-[#eef4f8] text-[#355872]">
                    <td className="px-6 py-5 font-medium">{item.judul_diajukan}</td>
                    <td className="px-6 py-5 text-gray-600">
                      {item.topik_detail?.user_detail?.nama_lengkap || "💡 Jalur Mandiri (Diusulkan)"}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase ${
                        item.status_pengajuan === "approved" ? "bg-green-100 text-green-700" :
                        item.status_pengajuan === "submitted" ? "bg-blue-100 text-blue-700" :
                        item.status_pengajuan === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {item.status_pengajuan}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ModalPengajuanMandiri open={openModal} onClose={() => setOpenModal(false)} onRefresh={fetchRiwayatSaya} />
    </div>
  );
}