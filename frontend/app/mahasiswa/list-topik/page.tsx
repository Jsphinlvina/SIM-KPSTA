"use client";

import { useState } from "react";
import Sidebar from "../../components/sidebar";
import ModalPengajuanMandiri from "./modal-pengajuan-mandiri";

export default function ListTopikPage() {
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("topik");

  const topics = [
    {
      title: "Sistem Deteksi ASD Menggunakan Deep Learning",
      lecturer: "Dr. Meliana, S.Kom",
      quota: 5,
      desc: "Penelitian deteksi Autism Spectrum Disorder berbasis AI.",
    },
    {
      title: "Website Monitoring IoT",
      lecturer: "Budi Santoso, M.Kom",
      quota: 3,
      desc: "Monitoring sensor IoT menggunakan dashboard web.",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F7F8F0]">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">
              List Topik
            </h1>

            <p className="text-gray-500 mt-2">
              Daftar topik kerja praktik
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="
              px-6
              h-12
              rounded-full
              bg-[#355872]
              hover:bg-[#7AAACE]
              text-white
              font-medium
              transition
              shadow-md
            "
          >
            Pengajuan Topik Mandiri +
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 mb-8 border-b border-[#dbe9f4]">
          <button
            onClick={() => setActiveTab("topik")}
            className={`
              pb-3
              text-sm
              font-semibold
              transition
              border-b-2
              ${
                activeTab === "topik"
                  ? "border-[#355872] text-[#355872]"
                  : "border-transparent text-gray-500 hover:text-[#355872]"
              }
            `}
          >
            Topik Dosen
          </button>

          <button
            onClick={() => setActiveTab("riwayat")}
            className={`
              pb-3
              text-sm
              font-semibold
              transition
              border-b-2
              ${
                activeTab === "riwayat"
                  ? "border-[#355872] text-[#355872]"
                  : "border-transparent text-gray-500 hover:text-[#355872]"
              }
            `}
          >
            Riwayat Pengajuan
          </button>
        </div>

        {/* TOPIK DOSEN */}
        {activeTab === "topik" && (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#e6eef5]">
            <table className="w-full">
              <thead className="bg-[#EAF4FB]">
                <tr className="text-left text-[#355872]">
                  <th className="px-6 py-4">Judul Topik</th>
                  <th className="px-6 py-4">Nama Dosen</th>
                  <th className="px-6 py-4">Kuota</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {topics.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-[#eef4f8]"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-[#355872] text-lg">
                          {item.title}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {item.lecturer}
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {item.quota}
                    </td>

                    <td className="px-6 py-5">
                      <button
                        className="
                          px-4
                          py-2
                          rounded-full
                          bg-[#355872]
                          hover:bg-[#7AAACE]
                          text-white
                          text-sm
                          transition
                        "
                      >
                        Ajukan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RIWAYAT PENGAJUAN */}
        {activeTab === "riwayat" && (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#e6eef5]">
            <table className="w-full">
              <thead className="bg-[#EAF4FB]">
                <tr className="text-left text-[#355872]">
                  <th className="px-6 py-4">Judul Topik</th>
                  <th className="px-6 py-4">Nama Dosen</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t border-[#eef4f8] text-[#355872]">
                  <td className="px-6 py-5">
                    Sistem Monitoring IoT
                  </td>

                  <td className="px-6 py-5">
                    Budi Santoso, M.Kom
                  </td>

                  <td className="px-6 py-5 ">
                    <span
                      className="
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        bg-yellow-100
                        text-yellow-700
                      "
                    >
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ModalPengajuanMandiri
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}