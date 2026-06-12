"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, FileText, Eye } from "lucide-react";
import Link from "next/link";
import api from "@/app/api";

type Document = {
  id: number;
  bimbingan_aktif_id: number;
  uploaded_by: number;
  document_type: "proposal" | "final_report";
  file_name: string;
  file_url: string;
  status: "draft" | "uploaded" | "verified" | "rejected";
  rejection_reason: string;
  created_at: string;
  updated_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  uploaded: "Diunggah",
  verified: "Terverifikasi",
  rejected: "Ditolak",
};

const STATUS_CLASS: Record<string, string> = {
  draft: "bg-gray-50 text-gray-600 border-gray-200",
  uploaded: "bg-blue-50 text-blue-700 border-blue-100",
  verified: "bg-green-50 text-green-700 border-green-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
};

export default function DocumentReviewPage() {
  const { bimbinganId } = useParams<{ bimbinganId: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState<{ docId: number } | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/document/by-bimbingan/${bimbinganId}/`)
      .then((res) => setDocuments(res.data.data || []))
      .catch((err) => console.error("Gagal memuat dokumen:", err))
      .finally(() => setLoading(false));
  }, [bimbinganId]);

  const handleVerify = async (docId: number) => {
    setActionLoading(true);
    try {
      await api.post(`/document/${docId}/verify/`);
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, status: "verified" } : d))
      );
    } catch (err) {
      console.error("Gagal memverifikasi dokumen:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal) return;
    setActionLoading(true);
    try {
      await api.post(`/document/${rejectModal.docId}/reject/`, { note: rejectNote });
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === rejectModal.docId
            ? { ...d, status: "rejected", rejection_reason: rejectNote }
            : d
        )
      );
      setRejectModal(null);
      setRejectNote("");
    } catch (err) {
      console.error("Gagal menolak dokumen:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col w-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-10">
        <Link
          href="/dosen/dashboard"
          className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872]"
        >
          <ArrowLeft size={32} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#355872]">Review Dokumen</h1>
          <p className="text-gray-500 mt-2 font-medium">
            Verifikasi atau tolak dokumen yang diunggah mahasiswa bimbingan
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] overflow-hidden flex-1">
        <div className="px-8 py-6 border-b border-[#f0f5fa]">
          <h2 className="text-xl font-bold text-[#355872]">Daftar Dokumen</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Periksa dokumen yang diunggah dan berikan keputusan verifikasi.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 bg-[#EAF4FB] px-8 py-4 font-semibold text-[#355872] border-b border-[#e6eef5] text-sm">
          <div className="col-span-1">No</div>
          <div className="col-span-2">Jenis</div>
          <div className="col-span-4">Nama File</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-right pr-2">Aksi</div>
        </div>

        <div className="divide-y divide-[#eef4f8]">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-400 font-medium">Memuat dokumen...</div>
          ) : documents.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 font-medium">
              Belum ada dokumen yang diunggah oleh mahasiswa ini.
            </div>
          ) : (
            documents.map((doc, i) => (
              <div
                key={doc.id}
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-[#F7F8F0]/30 transition"
              >
                <div className="col-span-1 text-[#355872] font-semibold">{i + 1}</div>

                <div className="col-span-2">
                  <span className="text-sm font-semibold text-[#355872]">
                    {doc.document_type === "proposal" ? "Proposal" : "Laporan Akhir"}
                  </span>
                </div>

                <div className="col-span-4 flex items-center gap-2">
                  <FileText size={14} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-[#355872] font-medium truncate">{doc.file_name}</span>
                </div>

                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      STATUS_CLASS[doc.status] ?? "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    {STATUS_LABEL[doc.status] ?? doc.status}
                  </span>
                  {doc.status === "rejected" && doc.rejection_reason && (
                    <p className="text-xs text-red-500 mt-1 italic">{doc.rejection_reason}</p>
                  )}
                </div>

                <div className="col-span-3 flex items-center justify-end pr-2 gap-2 flex-wrap">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-200 text-gray-600 border border-gray-200 text-xs font-bold transition"
                  >
                    <Eye size={13} />
                    Lihat
                  </a>

                  {doc.status === "uploaded" && (
                    <>
                      <button
                        onClick={() => handleVerify(doc.id)}
                        disabled={actionLoading}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-green-50 hover:bg-green-600 text-green-700 hover:text-white border border-green-100 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                      >
                        <CheckCircle2 size={13} />
                        Verifikasi
                      </button>
                      <button
                        onClick={() => setRejectModal({ docId: doc.id })}
                        disabled={actionLoading}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-100 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                      >
                        <XCircle size={13} />
                        Tolak
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-[#e6eef5]">
            <h3 className="text-xl font-bold text-[#355872] mb-2">Tolak Dokumen</h3>
            <p className="text-sm text-gray-500 mb-5">
              Berikan alasan penolakan agar mahasiswa dapat melakukan revisi.
            </p>
            <textarea
              className="w-full border border-[#d0e6f3] rounded-xl px-4 py-3 text-sm text-[#355872] focus:outline-none focus:ring-2 focus:ring-[#355872]/30 resize-none"
              rows={4}
              placeholder="Alasan penolakan (opsional)..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectNote("");
                }}
                className="px-5 py-2.5 rounded-xl border border-[#e6eef5] text-gray-600 font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition disabled:opacity-50 cursor-pointer"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
