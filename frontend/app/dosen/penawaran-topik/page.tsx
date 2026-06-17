"use client";

import { useMemo, useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import { Plus, Trash2, BookOpen, AlertCircle, Edit } from "lucide-react";
import api from "@/app/api";
import OfferTemplateBase from "./offer-template";

import DeleteConfirmModal from "./components/delete-confirm-modal";
import AddConfirmModal from "./components/add-confirm-modal";
import SuccessModal from "./components/success-modal";
import FailureModal from "./components/failure-modal";
import EditModal from "./components/edit-modal";
import EditConfirmModal from "./components/edit-confirm-modal";

type Offer = {
  id: number;
  topik: string;
  kuota: number;
  deskripsi: string;
};

type Step = "idle" | "saving";

class PenawaranTopikTemplate extends OfferTemplateBase {
  private header: () => React.ReactNode;
  private body: () => React.ReactNode;

  constructor(sidebar: React.ReactNode, header: () => React.ReactNode, body: () => React.ReactNode) {
    super(sidebar);
    this.header = header;
    this.body = body;
  }

  protected renderHeader(): React.ReactNode {
    return this.header();
  }

  protected renderMainCard(): React.ReactNode {
    return this.body();
  }
}

export default function PenawaranTopikDosenPage() {
  const [step, setStep] = useState<Step>("idle");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [dosenProfile, setDosenProfile] = useState<any>(null);

  // Form States
  const [topik, setTopik] = useState("");
  const [kuota, setKuota] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal States
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  // Edit States
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [tempEditData, setTempEditData] = useState({ judul: "", kuota: "", deskripsi: "" });

  // Dynamic Info for Modals
  const [successInfo, setSuccessInfo] = useState({ title: "", message: "" });
  const [failureInfo, setFailureInfo] = useState({ title: "", message: "" });

  // Fetch logged in profile
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

  // Fetch topics once profile loaded
  const fetchTopics = () => {
    if (dosenProfile) {
      api.get(`/topik/by-dosen/${dosenProfile.user_id}/`)
        .then((res) => {
          if (res.data.success) {
            const mapped = res.data.data.map((item: any) => ({
              id: item.topik_id,
              topik: item.judul,
              kuota: item.kuota,
              deskripsi: item.deskripsi,
            }));
            setOffers(mapped);
          }
        })
        .catch((err) => {
          console.error("Gagal memuat daftar topik:", err);
        });
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [dosenProfile]);

  // Pre-submit validation and trigger confirmation
  const handlePreCreateOffer = () => {
    const parsedKuota = Number(kuota);
    if (!topik.trim() || !deskripsi.trim()) {
      setErrorMessage("Judul topik dan deskripsi rencana bimbingan wajib diisi.");
      return;
    }
    if (!Number.isFinite(parsedKuota) || parsedKuota <= 0) {
      setErrorMessage("Kuota bimbingan harus diisi dengan angka positif lebih dari 0.");
      return;
    }

    setErrorMessage(null);
    setShowAddConfirmModal(true);
  };

  // Actual API call for topic creation
  const handleCreateOfferConfirm = () => {
    setShowAddConfirmModal(false);
    const parsedKuota = Number(kuota);

    setStep("saving");

    api.post("/topik/", {
      judul: topik.trim(),
      deskripsi: deskripsi.trim(),
      kuota: parsedKuota,
      prasyarat: "Kerja Praktik",
    })
      .then((res) => {
        if (res.data.success) {
          const item = res.data.data;
          setOffers((prev) => [
            ...prev,
            {
              id: item.topik_id,
              topik: item.judul,
              kuota: item.kuota,
              deskripsi: item.deskripsi,
            },
          ]);
          setTopik("");
          setKuota("");
          setDeskripsi("");
          
          setSuccessInfo({
            title: "Topik Berhasil Disiarkan",
            message: `Topik Kerja Praktik "${item.judul}" dengan kuota ${item.kuota} mahasiswa berhasil ditambahkan ke daftar penawaran Anda.`
          });
          setShowSuccessModal(true);
        }
        setStep("idle");
      })
      .catch((err) => {
        console.error("Gagal membuat topik:", err);
        const raw = err.response?.data?.message;
        const backendError = typeof raw === "string" ? raw : raw && typeof raw === "object" ? String(Object.values(raw)[0]) : "Gagal menyimpan topik penawaran ke database.";

        setFailureInfo({
          title: "Gagal Menambahkan Topik",
          message: backendError
        });
        setShowFailureModal(true);
        setStep("idle");
      });
  };

  // Actual API call for topic deletion
  const handleDeleteOfferConfirm = () => {
    if (deletingId === null) return;
    const targetId = deletingId;
    setDeletingId(null);

    api.delete(`/topik/${targetId}/`)
      .then((res) => {
        if (res.status === 204 || res.data?.success) {
          setOffers((prev) => prev.filter((o) => o.id !== targetId));
          
          setSuccessInfo({
            title: "Topik Berhasil Dihapus",
            message: "Topik penawaran Kerja Praktik tersebut berhasil dihapus secara permanen dari database."
          });
          setShowSuccessModal(true);
        }
      })
      .catch((err) => {
        console.error("Gagal menghapus topik:", err);
        setFailureInfo({
          title: "Gagal Menghapus Topik",
          message: "Terjadi kesalahan internal. Gagal menghapus topik penawaran dari database."
        });
        setShowFailureModal(true);
      });
  };

  const handleOpenEdit = (o: Offer) => {
    setEditingOffer(o);
    setShowEditModal(true);
  };

  const handleSaveEdit = (judul: string, kuota: string, deskripsi: string) => {
    setTempEditData({ judul, kuota, deskripsi });
    setShowEditModal(false);
    setShowEditConfirmModal(true);
  };

  const handleCancelEditConfirm = () => {
    setShowEditConfirmModal(false);
    setShowEditModal(true);
  };

  const handleUpdateOfferConfirm = () => {
    if (!editingOffer) return;
    setShowEditConfirmModal(false);
    setStep("saving");

    api.put(`/topik/${editingOffer.id}/`, {
      judul: tempEditData.judul,
      deskripsi: tempEditData.deskripsi,
      kuota: Number(tempEditData.kuota),
      prasyarat: "Kerja Praktik",
    })
      .then((res) => {
        if (res.data.success) {
          const item = res.data.data;
          setOffers((prev) =>
            prev.map((o) =>
              o.id === editingOffer.id
                ? {
                    id: item.topik_id,
                    topik: item.judul,
                    kuota: item.kuota,
                    deskripsi: item.deskripsi,
                  }
                : o
            )
          );
          setEditingOffer(null);

          setSuccessInfo({
            title: "Topik Berhasil Diperbarui",
            message: `Topik Kerja Praktik "${item.judul}" berhasil diperbarui secara permanen.`
          });
          setShowSuccessModal(true);
        }
        setStep("idle");
      })
      .catch((err) => {
        console.error("Gagal memperbarui topik:", err);
        const raw = err.response?.data?.message;
        const backendError = typeof raw === "string" ? raw : raw && typeof raw === "object" ? String(Object.values(raw)[0]) : "Gagal menyimpan perubahan ke database.";

        setFailureInfo({
          title: "Gagal Memperbarui Topik",
          message: backendError
        });
        setShowFailureModal(true);
        setStep("idle");
      });
  };

  const renderHeader = () => (
    <div className="mb-10 flex items-start justify-between w-full">
      <div>
        <h1 className="text-3xl font-bold text-[#355872]">
          Penawaran Topik Kerja Praktik
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Kelola dan siarkan topik Kerja Praktik Anda kepada mahasiswa aktif
        </p>
      </div>

      <div className="text-[#355872] font-bold bg-[#EAF4FB] px-5 py-3 rounded-2xl border border-[#9CD5FF]/20 shadow-sm text-sm">
        Dosen Pembimbing: <span className="text-gray-600 ml-1 font-semibold">{dosenProfile ? dosenProfile.nama_lengkap : "Memuat..."}</span>
      </div>
    </div>
  );

  const renderMainCard = () => (
    <div className="space-y-8 w-full">
      {/* Form Card (Top Section - Full Width) */}
      <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#355872]">Tambah Topik Penawaran</h2>
          <p className="text-xs text-gray-400 mt-1 font-medium">Siarkan topik baru untuk Kerja Praktik (KP)</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-700 text-sm p-4 rounded-2xl border border-red-100 font-medium flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Judul Topik */}
          <div className="col-span-12 md:col-span-9">
            <label className="block text-sm font-semibold text-[#355872] mb-2">Judul Topik Kerja Praktik</label>
            <input
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              placeholder="Contoh: Rancang Bangun Sistem Smart Grid Berbasis IoT"
              className="w-full h-12 px-4 rounded-xl border border-[#355872]/20 bg-white outline-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-medium placeholder:text-gray-400 transition"
            />
          </div>

          {/* Kuota */}
          <div className="col-span-12 md:col-span-3">
            <label className="block text-sm font-semibold text-[#355872] mb-2">Kuota Bimbingan (Mhs)</label>
            <input
              value={kuota}
              onChange={(e) => setKuota(e.target.value)}
              type="number"
              min={1}
              placeholder="Contoh: 3"
              className="w-full h-12 px-4 rounded-xl border border-[#355872]/20 bg-white outline-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-semibold placeholder:text-gray-400 transition"
            />
          </div>

          {/* Deskripsi */}
          <div className="col-span-12">
            <label className="block text-sm font-semibold text-[#355872] mb-2">Deskripsi Rencana Kerja Praktik</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={4}
              placeholder="Tuliskan deskripsi lengkap, batasan sistem, dan teknologi utama yang digunakan untuk Kerja Praktik ini..."
              className="w-full px-4 py-3 rounded-2xl border border-[#355872]/20 bg-white outline-none resize-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/10 text-gray-700 font-medium placeholder:text-gray-400 transition"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#e6eef5]">
          <button
            onClick={() => {
              setTopik("");
              setKuota("");
              setDeskripsi("");
              setErrorMessage(null);
            }}
            className="px-6 py-2.5 rounded-full bg-white border border-[#dbe9f4] text-[#355872] font-semibold hover:bg-gray-50 transition text-sm"
          >
            Reset Form
          </button>

          <button
            disabled={step === "saving"}
            onClick={handlePreCreateOffer}
            className="px-6 py-2.5 rounded-full bg-[#355872] hover:bg-[#7AAACE] text-white font-bold transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <Plus size={18} />
            {step === "saving" ? "Menyimpan..." : "Tambah Daftar Penawaran Topik"}
          </button>
        </div>
      </div>

      {/* List Card (Bottom Section - Full Width & Scrollable List) */}
      <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#355872]">Daftar Penawaran Topik Kerja Praktik Anda</h2>
          <p className="text-xs text-gray-400 mt-1 font-medium">Seluruh penawaran aktif Kerja Praktik yang sedang disiarkan ke mahasiswa (scroll ke bawah untuk melihat lebih banyak)</p>
        </div>

        {offers.length > 0 ? (
          <div className="overflow-y-auto max-h-[460px] pr-2 border border-[#eef4f8] rounded-2xl shadow-inner scrollbar-thin">
            <div className="divide-y divide-[#eef4f8]">
              {offers.map((o, i) => (
                <div
                  key={o.id}
                  className="bg-white p-6 hover:bg-[#F7F8F0]/30 transition flex items-start justify-between gap-6"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        Kuota: {o.kuota} Mahasiswa
                      </span>
                    </div>
                    <h3 className="font-bold text-[#355872] text-xl leading-snug">
                      {o.topik}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                      {o.deskripsi}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 mt-1">
                    <button
                      onClick={() => handleOpenEdit(o)}
                      className="p-3 text-[#355872] hover:text-[#7AAACE] hover:bg-[#EAF4FB] rounded-xl transition"
                      title="Edit Topik"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => setDeletingId(o.id)}
                      className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                      title="Hapus Topik"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-[#e6eef5] rounded-3xl">
            <BookOpen size={48} className="text-gray-300 mb-3" />
            <h4 className="font-bold text-[#355872] text-lg">Belum Ada Topik Kerja Praktik</h4>
            <p className="text-sm text-gray-400 mt-1 max-w-sm font-medium leading-relaxed">
              Anda belum merilis topik bimbingan Kerja Praktik untuk periode aktif ini.
            </p>
          </div>
        )}
      </div>

      {/* CONFIRMATION DELETE MODAL */}
      <DeleteConfirmModal
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteOfferConfirm}
      />

      {/* CONFIRMATION ADD MODAL */}
      <AddConfirmModal
        open={showAddConfirmModal}
        onClose={() => setShowAddConfirmModal(false)}
        onConfirm={handleCreateOfferConfirm}
        title={topik}
        kuota={kuota}
        deskripsi={deskripsi}
      />

      {/* EDIT MODAL */}
      <EditModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingOffer(null);
        }}
        onSave={handleSaveEdit}
        initialJudul={editingOffer?.topik || ""}
        initialKuota={editingOffer?.kuota ? String(editingOffer.kuota) : ""}
        initialDeskripsi={editingOffer?.deskripsi || ""}
      />

      {/* CONFIRMATION EDIT MODAL */}
      <EditConfirmModal
        open={showEditConfirmModal}
        onClose={handleCancelEditConfirm}
        onConfirm={handleUpdateOfferConfirm}
        title={tempEditData.judul}
        kuota={tempEditData.kuota}
        deskripsi={tempEditData.deskripsi}
      />

      {/* TRANSACTION SUCCESS MODAL */}
      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successInfo.title}
        message={successInfo.message}
      />

      {/* TRANSACTION FAILURE MODAL */}
      <FailureModal
        open={showFailureModal}
        onClose={() => setShowFailureModal(false)}
        title={failureInfo.title}
        message={failureInfo.message}
      />
    </div>
  );

  const template = new PenawaranTopikTemplate(<Sidebar />, renderHeader, renderMainCard);
  return template.renderPage() as any;
}
