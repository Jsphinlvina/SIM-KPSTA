"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Upload, ArrowLeft, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../../api";

interface Document {
  id: number;
  file_name: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  submitted: "Dikirim",
  verified: "Diverifikasi",
  rejected: "Butuh Revisi",
};

const STATUS_CLASS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  submitted: "bg-yellow-100 text-yellow-700",
  verified: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function UploadLaporanPage() {
  const [bimbinganId, setBimbinganId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [dosenNama, setDosenNama] = useState("—");
  const [topikJudul, setTopikJudul] = useState("—");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await api.get("/auth/me/");
        const uid: number = meRes.data.data?.user_id;
        setUserId(uid);

        const bimRes = await api.get(`/bimbingan/by-mahasiswa/${uid}/`);
        const bimList: any[] = bimRes.data.data || [];
        if (bimList.length === 0) { setLoading(false); return; }

        const bim = bimList[0];
        setBimbinganId(bim.id);
        setDosenNama(bim.dosen_detail?.nama_lengkap ?? "—");
        setTopikJudul(bim.pengajuan_detail?.topik_detail?.judul ?? "—");

        const docRes = await api.get(`/document/by-bimbingan/${bim.id}/`);
        setDocuments(docRes.data.data || []);
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !bimbinganId || !userId) return;

    setUploading(true);
    const form = new FormData();
    form.append("bimbingan_aktif_id", String(bimbinganId));
    form.append("uploaded_by", String(userId));
    form.append("file", file);

    try {
      const res = await api.post("/document/upload/laporan-akhir/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDocuments((prev) => [res.data.data, ...prev]);
      showToast("Laporan berhasil diunggah.", true);
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Upload gagal.", false);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="p-10 flex flex-col w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-start gap-4">
          <Link
            href="/mahasiswa"
            className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872]"
          >
            <ArrowLeft size={32} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">Kirim Laporan</h1>
            <p className="text-gray-500 mt-2">Kirim Laporan Kerja Praktik</p>
          </div>
        </div>

        <label
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white transition shrink-0 ${
            uploading || !bimbinganId
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#355872] hover:bg-[#7AAACE] cursor-pointer"
          }`}
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span className="font-medium">{uploading ? "Mengunggah..." : "Upload"}</span>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            disabled={uploading || !bimbinganId}
            onChange={handleUpload}
          />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : !bimbinganId ? (
        <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-12 text-center text-gray-500">
          Belum ada bimbingan aktif. Upload laporan tersedia setelah dosen pembimbing ditetapkan.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8">
          {/* Bimbingan Info */}
          <div className="flex items-start justify-between mb-10">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#355872]">{topikJudul}</h2>
              <p className="text-gray-600">Dosen Pembimbing: {dosenNama}</p>
            </div>
          </div>

          {/* Upload History */}
          <div className="space-y-4">
            {documents.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Belum ada dokumen yang diunggah.</p>
            ) : (
              documents.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between bg-[#EAF4FB] border border-[#e6eef5] rounded-2xl px-6 py-5"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-[#355872] text-white flex items-center justify-center font-semibold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-[#355872] font-medium">{doc.file_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(doc.created_at).toLocaleDateString("id-ID")}
                      </p>
                      {doc.rejection_reason && (
                        <p className="text-xs text-red-500 mt-1">Catatan: {doc.rejection_reason}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      STATUS_CLASS[doc.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_LABEL[doc.status] ?? doc.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-10 z-50">
          <div
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg text-white text-sm font-medium ${
              toast.ok ? "bg-[#355872]" : "bg-red-500"
            }`}
          >
            {toast.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
