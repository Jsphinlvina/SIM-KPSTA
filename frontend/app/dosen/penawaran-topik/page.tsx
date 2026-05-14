"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/app/components/sidebar";

import OfferTemplateBase from "./offer-template";

type Offer = {
  id: number;
  topik: string;
  kuota: number;
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
  const [offers, setOffers] = useState<Offer[]>([
    { id: 1, topik: "Sistem Informasi KP", kuota: 5 },
    { id: 2, topik: "AI untuk Edukasi", kuota: 3 },
  ]);

  const nextId = useMemo(() => {
    const max = offers.reduce((acc, o) => Math.max(acc, o.id), 0);
    return max + 1;
  }, [offers]);

  const [topik, setTopik] = useState("");
  const [kuota, setKuota] = useState<string>("");

  const renderHeader = () => (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-[#355872]">Penawaran Topik KP</h1>
      <p className="text-gray-500 mt-2">Tambahkan topik KP beserta kuota mahasiswa yang dibutuhkan.</p>
    </div>
  );

  const renderMainCard = () => (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] p-8">
        <h2 className="text-xl font-bold text-[#355872] mb-6">Tambah Topik</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#355872] mb-2">Topik KP</label>
            <input
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              placeholder="Contoh: Web Monitoring KP"
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

        <div className="mt-6 flex gap-3">
          <button
            disabled={step === "saving"}
            onClick={() => {
              const parsedKuota = Number(kuota);
              if (!topik.trim()) return;
              if (!Number.isFinite(parsedKuota) || parsedKuota <= 0) return;

              setStep("saving");

              // Dummy save (FE hanya menampilkan state lokal)
              setTimeout(() => {
                setOffers((prev) => [...prev, { id: nextId, topik: topik.trim(), kuota: parsedKuota }]);
                setTopik("");
                setKuota("");
                setStep("idle");
              }, 400);
            }}
            className="px-6 py-2 rounded-2xl bg-[#355872] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {step === "saving" ? "Menyimpan..." : "Tambah"}
          </button>

          <button
            onClick={() => {
              setTopik("");
              setKuota("");
            }}
            className="px-6 py-2 rounded-2xl bg-white border border-[#e6eef5] text-[#355872] font-semibold hover:bg-[#F7F8F0] transition"
          >
            Reset
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">*Data ini masih dummy (FE hanya menampilkan state lokal).</p>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] p-8">
        <h2 className="text-xl font-bold text-[#355872] mb-6">Daftar Penawaran</h2>

        <div className="space-y-4">
          {offers.map((o, i) => (
            <div
              key={o.id}
              className="flex items-center justify-between bg-white border border-[#e6eef5] rounded-2xl px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#355872]">{i + 1}.</span>
                <div>
                  <p className="font-medium text-[#355872]">{o.topik}</p>
                  <p className="text-sm text-gray-500">
                    Kuota: <span className="font-semibold text-[#355872]">{o.kuota}</span> mahasiswa
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTopik(o.topik);
                    setKuota(String(o.kuota));
                    // trick: hapus lalu submit lagi untuk "edit"
                    setOffers((prev) => prev.filter((x) => x.id !== o.id));
                  }}
                  className="px-4 py-1 rounded-xl bg-[#EAF4FB] text-[#355872] text-sm hover:bg-[#d7ebfb] transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setOffers((prev) => prev.filter((x) => x.id !== o.id));
                  }}
                  className="px-4 py-1 rounded-xl bg-red-100 text-red-700 text-sm hover:opacity-90 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const template = new PenawaranTopikTemplate(<Sidebar />, renderHeader, renderMainCard);
  return template.renderPage() as any;
}

