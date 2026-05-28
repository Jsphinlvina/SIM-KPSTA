"use client";

import { useMemo, useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import api from "@/app/api";

import OfferTemplateBase from "./offer-template";

type Offer = {
  topik_id: number;
  judul: string;
  deskripsi: string;
  kuota: number;
};

type Step = "idle" | "saving" | "loading";

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
  
  const [topik, setTopik] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kuota, setKuota] = useState<string>("");
  
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchMyTopics = async () => {
    try {
      setStep("loading");
      const res = await api.get("/topik/");
      if (res.data.success) {
        setOffers(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat topik dosen:", err);
    } finally {
      setStep("idle");
    }
  };

  useEffect(() => {
    fetchMyTopics();
  }, []);

  const handleSave = async () => {
    const parsedKuota = Number(kuota);
    if (!topik.trim() || !deskripsi.trim()) {
      alert("Judul topik dan deskripsi wajib diisi!");
      return;
    }
    if (!Number.isFinite(parsedKuota) || parsedKuota <= 0) {
      alert("Kuota mahasiswa harus berupa angka positif!");
      return;
    }

    try {
      setStep("saving");
      
      const payload = {
        judul: topik.trim(),
        deskripsi: deskripsi.trim(),
        prasyarat: "Terbuka untuk mahasiswa yang memenuhi syarat standar akademik.", 
        kuota: parsedKuota
      };

      if (editingId) {
        const res = await api.put(`/topik/${editingId}/`, payload);
        if (res.data.success) {
          alert("Topik penawaran berhasil diperbarui!");
        }
      } else {
        const res = await api.post("/topik/", payload);
        if (res.data.success) {
          alert("Topik penawaran baru berhasil disiarkan!");
        }
      }

      handleReset();
      fetchMyTopics();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan topik ke database.");
    } finally {
      setStep("idle");
    }
  };

  const handleDelete = async (topikId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus topik penawaran ini secara permanen?")) return;
    try {
      setStep("loading");
      const res = await api.delete(`/topik/${topikId}/`);
      if (res.data.success || res.status === 200 || res.status === 204) {
        alert("Topik berhasil dihapus.");
        fetchMyTopics();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menghapus topik.");
    } finally {
      setStep("idle");
    }
  };

  const handleReset = () => {
    setTopik("");
    setDeskripsi("");
    setKuota("");
    setEditingId(null);
  };

  const renderHeader = () => (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-[#355872]">Penawaran Topik KP</h1>
      <p className="text-gray-500 mt-2">Tambahkan topik KP beserta kuota mahasiswa yang Anda butuhkan semester ini.</p>
    </div>
  );

  const renderMainCard = () => (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] p-8">
        <h2 className="text-xl font-bold text-[#355872] mb-6">
          {editingId ? "✏️ Edit Topik Penawaran" : "➕ Tambah Topik Baru"}
        </h2>

        <div className="grid grid-cols-1 gap-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#355872] mb-2">Judul Topik KP</label>
              <input
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                placeholder="Contoh: Pengembangan Website Monitoring KP Berbasis WebSocket"
                className="w-full px-4 py-2 rounded-2xl border border-[#e6eef5] bg-white outline-none focus:ring-2 focus:ring-[#b9d6ef] text-[#355872]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#355872] mb-2">Kuota Mahasiswa</label>
              <input
                value={kuota}
                onChange={(e) => setKuota(e.target.value)}
                type="number"
                min={1}
                placeholder="Contoh: 4"
                className="w-full px-4 py-2 rounded-2xl border border-[#e6eef5] bg-white outline-none focus:ring-2 focus:ring-[#b9d6ef] text-[#355872]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#355872] mb-2">Deskripsi & Kriteria Prasyarat</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              placeholder="Jelaskan secara singkat ruang lingkup topik dan keahlian yang diharapkan dari mahasiswa..."
              className="w-full px-4 py-3 rounded-2xl border border-[#e6eef5] bg-white outline-none focus:ring-2 focus:ring-[#b9d6ef] text-[#355872] resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            disabled={step === "saving" || step === "loading"}
            onClick={handleSave}
            className="px-6 py-2 rounded-2xl bg-[#355872] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {step === "saving" ? "Menyimpan..." : editingId ? "Perbarui" : "Siarkan Topik"}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-2xl bg-white border border-[#e6eef5] text-[#355872] font-semibold hover:bg-[#F7F8F0] transition"
          >
            Reset / Cancel
          </button>
        </div>
      </div>

      {/* List Penawaran Aktif */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] p-8">
        <h2 className="text-xl font-bold text-[#355872] mb-6">Daftar Penawaran Aktif Anda</h2>

        {step === "loading" && offers.length === 0 ? (
          <p className="text-center py-4 text-gray-500 animate-pulse">Menghubungkan ke database PostgreSQL...</p>
        ) : offers.length === 0 ? (
          <p className="text-center py-6 text-gray-400">Anda belum menyiarkan penawaran topik apa pun semester ini.</p>
        ) : (
          <div className="space-y-4">
            {offers.map((o, i) => (
              <div
                key={o.topik_id}
                className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-[#e6eef5] rounded-2xl px-5 py-4 gap-4"
              >
                <div className="flex items-start gap-4">
                  <span className="font-semibold text-[#355872] mt-0.5">{i + 1}.</span>
                  <div>
                    <p className="font-semibold text-[#355872] text-lg">{o.judul}</p>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{o.deskripsi}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Sisa Kuota Bimbingan: <span className="font-bold text-[#355872]">{o.kuota}</span> mahasiswa
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => {
                      setEditingId(o.topik_id);
                      setTopik(o.judul);
                      setDeskripsi(o.deskripsi);
                      setKuota(String(o.kuota));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#EAF4FB] text-[#355872] text-sm font-medium hover:bg-[#d7ebfb] transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(o.topik_id)}
                    className="px-4 py-1.5 rounded-xl bg-red-100 text-red-700 text-sm font-medium hover:opacity-90 transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const template = new PenawaranTopikTemplate(<Sidebar />, renderHeader, renderMainCard);
  return template.renderPage() as any;
}