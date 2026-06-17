"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, X, AlertCircle } from "lucide-react";
import ModalPengajuanMandiri from "./modal-pengajuan-mandiri";
import Sidebar from "@/app/components/sidebar";
import api from "@/app/api";

type TopicItem = {
  title: string;
  lecturer: string;
  quota: number;
  desc: string;
  topik_id?: number;
  periode?: string;
};

type HistoryItem = {
  id: number;
  title: string;
  lecturer: string;
  status: string;
  periodeId?: number;
};

export default function ListTopikPage() {
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("topik");
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activePeriodeId, setActivePeriodeId] = useState<number | null>(null);

  // Selection modal state
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [deskripsiSistem, setDeskripsiSistem] = useState("");
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);

  const fetchTopics = () => {
    api.get("/topik/available/")
      .then((res) => {
        if (res.data.success) {
          const mapped = (res.data.data ?? []).map((item: any) => ({
            title: item.judul,
            lecturer: item.dosen_detail ? item.dosen_detail.nama_lengkap : "Tidak diketahui",
            quota: item.kuota,
            desc: item.deskripsi,
            topik_id: item.topik_id,
            periode: item.periode_detail?.nama_periode ?? "-",
          }));
          setTopics(mapped);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil daftar topik:", err);
      });
  };

  const fetchHistory = () => {
    api.get("/pengajuan/riwayat/")
      .then((res) => {
        if (res.data.success) {
          const mapped = res.data.data.map((item: any) => ({
            id: item.pengajuan_kp_id,
            title: item.judul_diajukan,
            lecturer: item.topik_detail?.dosen_detail?.nama_lengkap ?? "Jalur Mandiri / Usulan Sendiri",
            status: item.status_pengajuan,
            periodeId: item.periode_detail?.periode_semester_id ?? null,
          }));
          setHistory(mapped);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil riwayat pengajuan:", err);
      });
  };

  useEffect(() => {
    api.get("/topik/periode-semester/active/")
      .then((res) => {
        if (res.data.success) setActivePeriodeId(res.data.data?.periode_semester_id ?? null);
      })
      .catch(() => {});
    fetchTopics();
    fetchHistory();
  }, []);

  const hasActiveSubmission = history.some(
    (item) =>
      (item.status === "submitted" || item.status === "approved") &&
      item.periodeId === activePeriodeId
  );

  const handleOpenProposal = (topic: TopicItem) => {
    setSelectedTopic(topic);
    setDeskripsiSistem("");
    setProposalError(null);
  };

  const handleCloseProposal = () => {
    setSelectedTopic(null);
    setDeskripsiSistem("");
    setProposalError(null);
  };

  const submitLecturerProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic) return;
    if (!deskripsiSistem.trim()) {
      setProposalError("Silakan isi deskripsi rencana sistem terlebih dahulu.");
      return;
    }

    setSubmittingProposal(true);
    setProposalError(null);

    try {
      const response = await api.post("/pengajuan/topik-dosen/", {
        topik: selectedTopic.topik_id,
        deskripsi_sistem: deskripsiSistem.trim(),
      });

      if (response.data.success) {
        handleCloseProposal();
        fetchTopics();
        fetchHistory();
        setActiveTab("riwayat");
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Gagal mengajukan topik dosen ini.";
      setProposalError(msg);
    } finally {
      setSubmittingProposal(false);
    }
  };

  return (
    <div className="w-full min-h-full bg-[#F7F8F0]">
      <div className="p-10 flex flex-col">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        
        <div className="flex items-start gap-4">
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
              Daftar Topik Kerja Praktik
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              {activeTab === "topik" ? "Pilih topik dari dosen pembimbing" : "Riwayat status pengajuan topik mandiri"}
            </p>
          </div>
        </div>

        {!hasActiveSubmission && (
          <button
            onClick={() => setOpenModal(true)}
            className="
              px-6
              h-12
              rounded-full
              bg-[#355872]
              hover:bg-[#7AAACE]
              text-white
              font-semibold
              transition
              shadow-sm
            "
          >
            Pengajuan Topik Mandiri +
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 mb-8 border-b border-[#dbe9f4]">
        <button
          onClick={() => setActiveTab("topik")}
          className={`
            pb-3
            text-sm
            font-bold
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
            font-bold
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

      {/* Active submission banner */}
      {hasActiveSubmission && (
        <div className="flex items-center gap-3 mb-6 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
          <AlertCircle size={18} className="shrink-0 text-amber-500" />
          Anda sudah memiliki pengajuan yang sedang diproses. Pengajuan baru hanya dapat dilakukan setelah pengajuan sebelumnya ditolak.
        </div>
      )}

      {/* TOPIK DOSEN */}
      {activeTab === "topik" && (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#e6eef5]">
          <table className="w-full">
            <thead className="bg-[#EAF4FB]">
              <tr className="text-left text-[#355872] font-semibold text-sm">
                <th className="px-6 py-4">Judul Topik</th>
                <th className="px-6 py-4">Nama Dosen</th>
                <th className="px-6 py-4">Kuota Tersisa</th>
                <th className="px-6 py-4 text-right pr-10">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#eef4f8]">
              {topics.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                    Belum ada topik yang tersedia untuk periode ini.
                  </td>
                </tr>
              )}
              {topics.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#F7F8F0]/30 transition"
                >
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-bold text-[#355872] text-lg">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 font-medium leading-relaxed">
                        {item.desc}
                      </p>
                      {item.periode && (
                        <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF4FB] text-[#355872]">
                          {item.periode}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-[#355872] font-semibold text-base">
                    {item.lecturer}
                  </td>

                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      item.quota > 0 ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                      {item.quota} slot
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right pr-10">
                    {!hasActiveSubmission && (
                      <button
                        onClick={() => handleOpenProposal(item)}
                        disabled={item.quota <= 0 || !item.topik_id}
                        className="
                          px-5
                          py-2
                          rounded-full
                          bg-[#355872]
                          hover:bg-[#7AAACE]
                          text-white
                          text-sm
                          font-semibold
                          transition
                          disabled:opacity-40
                          disabled:cursor-not-allowed
                        "
                      >
                        Ajukan Topik
                      </button>
                    )}
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
          {history.length > 0 ? (
            <table className="w-full">
              <thead className="bg-[#EAF4FB]">
                <tr className="text-left text-[#355872] font-semibold text-sm">
                  <th className="px-6 py-4">Judul Topik Yang Diajukan</th>
                  <th className="px-6 py-4">Dosen Pembimbing</th>
                  <th className="px-6 py-4 text-right pr-10">Status Pengajuan</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eef4f8]">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F8F0]/30 transition">
                    <td className="px-6 py-5 font-bold text-[#355872] text-lg">
                      {item.title}
                    </td>

                    <td className="px-6 py-5 text-[#355872] font-semibold">
                      {item.lecturer}
                    </td>

                    <td className="px-6 py-5 text-right pr-10">
                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          px-4
                          py-1.5
                          rounded-full
                          text-xs
                          font-bold
                          border
                          ${
                            item.status === "approved"
                              ? "bg-green-50 text-green-700 border-green-150"
                              : item.status === "rejected"
                              ? "bg-red-50 text-red-700 border-red-150"
                              : "bg-amber-50 text-amber-700 border-amber-150"
                          }
                        `}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === "approved"
                            ? "bg-green-500"
                            : item.status === "rejected"
                            ? "bg-red-500"
                            : "bg-amber-500"
                        }`}></span>
                        {item.status === "approved" ? "Disetujui" : item.status === "rejected" ? "Ditolak" : "Menunggu"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500 font-semibold">
              Belum ada riwayat pengajuan judul.
            </div>
          )}
        </div>
      )}

      {/* POPUP CONFIRMATION FOR DOSEN TOPIC */}
      {selectedTopic && (
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
          <div className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl relative">
            <button
              onClick={handleCloseProposal}
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

            <h2 className="text-2xl font-bold text-[#355872] mb-4">
              Ajukan Topik Dosen
            </h2>

            <div className="bg-[#EAF4FB] p-5 rounded-2xl border border-[#9CD5FF]/20 mb-6 space-y-2.5">
              <div>
                <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Judul Topik</span>
                <p className="font-bold text-[#355872] text-base leading-snug">{selectedTopic.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#355872]/10">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Dosen Pembimbing</span>
                  <p className="font-semibold text-gray-600 text-sm">{selectedTopic.lecturer}</p>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Kuota Tersedia</span>
                  <p className="font-semibold text-gray-600 text-sm">{selectedTopic.quota} slot</p>
                </div>
              </div>
            </div>

            {proposalError && (
              <div className="bg-red-50 text-red-700 text-sm p-4 rounded-2xl border border-red-100 mb-6 font-medium flex items-start gap-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{proposalError}</span>
              </div>
            )}

            <form onSubmit={submitLecturerProposal} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#355872]">
                  Deskripsi Rencana & Ruang Lingkup Sistem
                </label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan secara singkat rencana pengerjaan Anda untuk topik ini..."
                  value={deskripsiSistem}
                  onChange={(e) => setDeskripsiSistem(e.target.value)}
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-[#355872]/30
                    px-4
                    py-3
                    outline-none
                    resize-none
                    focus:border-[#355872]
                    focus:ring-2
                    focus:ring-[#355872]/20
                    text-gray-700
                    placeholder:text-gray-400
                    transition
                  "
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e6eef5]">
                <button
                  type="button"
                  onClick={handleCloseProposal}
                  className="
                    px-6
                    py-2.5
                    rounded-full
                    border
                    border-[#dbe9f4]
                    text-gray-600
                    hover:bg-gray-50
                    transition
                    font-medium
                  "
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submittingProposal}
                  className="
                    px-6
                    py-2.5
                    rounded-full
                    bg-[#355872]
                    hover:bg-[#7AAACE]
                    text-white
                    transition
                    font-medium
                    disabled:opacity-50
                  "
                >
                  {submittingProposal ? "Mengirim..." : "Kirim Pengajuan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ModalPengajuanMandiri
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          fetchTopics();
          fetchHistory();
          setActiveTab("riwayat");
        }}
      />
      </div>
    </div>
  );
}