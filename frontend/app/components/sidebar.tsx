"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  FileText,
  LayoutDashboard,
} from "lucide-react";

type SidebarRole = "mahasiswa" | "dosen" | "admin";

function SidebarContent({ role }: { role: SidebarRole }) {
  const isDosen = role === "dosen";
  const isAdmin = role === "admin";

  return (
    <div className="w-64 min-h-screen bg-white border-r border-[#dbe9f4] shadow-sm">
      <div className="h-16 flex items-center justify-center overflow-hidden">
        <Image
          src="/text-sim-kp.png"
          alt="Logo"
          width={200}
          height={60}
          className="object-contain -mb-8"
        />
      </div>

      <div className="p-4 space-y-2">
        {/* Dashboard */}
        <div>
          <Link
            href={
              isAdmin
                ? "/admin/user"
                : isDosen
                  ? "/dosen/dashboard"
                  : "/mahasiswa/list-topik"
            }
            className="flex items-center gap-3 text-[#355872] font-medium px-3 py-2 rounded-lg hover:bg-[#F7F8F0] transition"
          >
            <LayoutDashboard size={18} />
            <span>{isAdmin ? "Admin" : "Dashboard"}</span>
          </Link>

          {isAdmin ? (
            <div className="mt-2 ml-1 space-y-1">
              <Link
                href="/admin/penentuan-dosen-pembimbing"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-[#F7F8F0] rounded-lg transition"
              >
                <ChevronRight size={14} />
                <span>Penentuan Dosen Pembimbing</span>
              </Link>

              <Link
                href="/admin/user"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-[#F7F8F0] rounded-lg transition"
              >
                <ChevronRight size={14} />
                <span>Daftar User</span>
              </Link>
            </div>
          ) : null}
        </div>

        {/* Category */}
        {!isAdmin ? (
          <div>
            <div className="flex items-center justify-between px-3 py-2 bg-[#EAF4FB] rounded-lg text-[#355872] font-semibold">
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                <span>
                  {isDosen ? "Penawaran & Approval" : "Bimbingan & Topik"}
                </span>
              </div>
              <ChevronRight size={16} />
            </div>

            <div className="mt-2 ml-3 space-y-1">
              {isDosen ? (
                <>
                  <Link
                    href="/dosen/approval"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-[#F7F8F0] rounded-lg transition"
                  >
                    <ChevronRight size={14} />
                    <span>Approval Bimbingan</span>
                  </Link>

                  <Link
                    href="/dosen/penawaran-topik"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-[#F7F8F0] rounded-lg transition"
                  >
                    <ChevronRight size={14} />
                    <span>Penawaran Topik</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/mahasiswa/list-topik"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-[#F7F8F0] rounded-lg transition"
                  >
                    <ChevronRight size={14} />
                    <span>List Topik</span>
                  </Link>

                  <Link
                    href="/mahasiswa/jadwal-bimbingan"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-[#F7F8F0] rounded-lg transition"
                  >
                    <ChevronRight size={14} />
                    <span>Jadwal Bimbingan</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}

        {/* Dokumen */}
        <div>
          <div className="flex items-center gap-2 px-3 py-2 text-[#355872] font-semibold hover:bg-[#F7F8F0] rounded-lg transition">
            <FileText size={18} />
            <span>Dokumen</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const path =
    typeof window !== "undefined" ? window.location.pathname : "";

  const role: SidebarRole = path.startsWith("/admin")
    ? "admin"
    : path.startsWith("/dosen")
      ? "dosen"
      : "mahasiswa";

  return <SidebarContent role={role} />;
}

