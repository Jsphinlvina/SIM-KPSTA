"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  ChevronRight,
  BookOpen,
  FileText,
  Users,
  Settings,
  LogOut,
  Award,
} from "lucide-react";

type SidebarRole = "mahasiswa" | "dosen" | "admin" | "koordinator";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function SidebarLink({ href, icon, label, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${
          active
            ? "bg-[#355872] text-white font-semibold shadow-md shadow-[#355872]/15 translate-x-1"
            : "text-[#355872] hover:bg-[#F7F8F0] hover:text-[#355872] hover:translate-x-1"
        }
      `}
    >
      <span className={`transition-transform duration-200 ${active ? "" : "group-hover:scale-110"}`}>
        {icon}
      </span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}

interface SidebarSubLinkProps {
  href: string;
  label: string;
  active: boolean;
}

function SidebarSubLink({ href, label, active }: SidebarSubLinkProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group
        ${
          active
            ? "bg-[#EAF4FB] text-[#355872] font-semibold border-l-4 border-[#355872] pl-3"
            : "text-gray-600 hover:bg-[#F7F8F0] hover:text-[#355872] hover:translate-x-1 pl-4"
        }
      `}
    >
      <ChevronRight
        size={14}
        className={`transition-transform duration-200 ${
          active ? "text-[#355872] translate-x-0.5" : "text-gray-400 group-hover:translate-x-0.5"
        }`}
      />
      <span>{label}</span>
    </Link>
  );
}

function SidebarContent({ role }: { role: SidebarRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const isDosen = role === "dosen";
  const isAdmin = role === "admin";
  const isKoordinator = role === "koordinator";
  const isMahasiswa = role === "mahasiswa";

  // Home (Welcome Page / Landing Hub with cards)
  const isHomeActive = isKoordinator
    ? pathname === "/koordinator"
    : isAdmin
    ? pathname === "/admin"
    : isDosen
    ? pathname === "/dosen"
    : pathname === "/mahasiswa";

  // Check if main category section has any active child
  const isCategoryActive = isKoordinator
    ? pathname === "/koordinator/penentuan-pembimbing" ||
      pathname === "/koordinator/distribusi-dosen" ||
      pathname === "/koordinator/laporan" ||
      pathname === "/koordinator/kelayakan-pembimbing" ||
      pathname === "/koordinator/arsip" ||
      pathname === "/koordinator/jadwal-sidang"
    : isAdmin
    ? pathname === "/admin/user" ||
      pathname === "/admin/periode-semester"
    : isDosen
    ? pathname === "/dosen/dashboard" ||
      pathname === "/dosen/approval" ||
      pathname === "/dosen/penawaran-topik" ||
      pathname === "/dosen/kelayakan-pembimbing"
    : pathname === "/mahasiswa/list-topik" ||
      pathname === "/mahasiswa/jadwal-bimbingan";

  // Check if Dokumen section has any active child (Mahasiswa only)
  const isDokumenActive = isMahasiswa && pathname === "/mahasiswa/upload-laporan";

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://127.0.0.1:8000/api/auth/logout/", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (_) {}
    localStorage.removeItem("token");
    localStorage.removeItem("nim_nip");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-[#dbe9f4] shadow-sm flex flex-col justify-between sticky top-0 h-screen">
      <div>
        {/* Logo Container */}
        <div className="h-20 flex items-center justify-center border-b border-[#f0f5fa] px-6">
          <Image
            src="/text-sim-kp.png"
            alt="Logo SIM-KP"
            width={160}
            height={48}
            priority
            className="object-contain"
            style={{ height: "auto" }}
          />
        </div>

        {/* Sidebar Navigation */}
        <div className="p-4 space-y-6 mt-4">
          {/* Home Section (Goes back to Welcome Hub) */}
          <div className="space-y-1">
            <SidebarLink
              href={isKoordinator ? "/koordinator" : isAdmin ? "/admin" : isDosen ? "/dosen" : "/mahasiswa"}
              icon={<Home size={18} />}
              label="Menu Utama"
              active={isHomeActive}
            />
          </div>

          {/* MAIN CATEGORY SECTION */}
          <div className="space-y-2">
            <div
              className={`
                flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300
                ${
                  isCategoryActive
                    ? "bg-[#EAF4FB]/70 text-[#355872] font-semibold border-l-4 border-[#355872] pl-2.5 shadow-sm"
                    : "text-[#355872]/80 font-medium pl-3"
                }
              `}
            >
              <div className="flex items-center gap-2">
                {isKoordinator ? (
                  <Award size={18} className={isCategoryActive ? "text-[#355872]" : ""} />
                ) : isAdmin ? (
                  <Settings size={18} className={isCategoryActive ? "text-[#355872]" : ""} />
                ) : (
                  <BookOpen size={18} className={isCategoryActive ? "text-[#355872]" : ""} />
                )}
                <span className="text-xs uppercase tracking-wider font-bold">
                  {isKoordinator
                    ? "Evaluasi & Laporan"
                    : isAdmin
                    ? "Data Master"
                    : isDosen
                    ? "Penawaran & Approval"
                    : "Bimbingan & Topik"}
                </span>
              </div>
            </div>

            <div className="mt-1 ml-1 space-y-1.5">
              {isKoordinator ? (
                <>
                  <SidebarSubLink
                    href="/koordinator/penentuan-pembimbing"
                    label="Penentuan Pembimbing"
                    active={pathname === "/koordinator/penentuan-pembimbing"}
                  />
                  <SidebarSubLink
                    href="/koordinator/kelayakan-pembimbing"
                    label="Kelayakan Pembimbing"
                    active={pathname === "/koordinator/kelayakan-pembimbing"}
                  />
                  <SidebarSubLink
                    href="/koordinator/distribusi-dosen"
                    label="Beban Kerja Dosen"
                    active={pathname === "/koordinator/distribusi-dosen"}
                  />
                  <SidebarSubLink
                    href="/koordinator/laporan"
                    label="Laporan Statistik"
                    active={pathname === "/koordinator/laporan"}
                  />
                  <SidebarSubLink
                    href="/koordinator/arsip"
                    label="Arsip"
                    active={pathname === "/koordinator/arsip"}
                  />
                  <SidebarSubLink
                    href="/koordinator/jadwal-sidang"
                    label="Jadwal Sidang"
                    active={pathname === "/koordinator/jadwal-sidang"}
                  />
                </>
              ) : isAdmin ? (
                <>
                  <SidebarSubLink
                    href="/admin/user"
                    label="Kelola User"
                    active={pathname === "/admin/user"}
                  />
                  <SidebarSubLink
                    href="/admin/periode-semester"
                    label="Periode Semester"
                    active={pathname === "/admin/periode-semester"}
                  />
                </>
              ) : isDosen ? (
                <>
                  <SidebarSubLink
                    href="/dosen/dashboard"
                    label="Dashboard"
                    active={pathname === "/dosen/dashboard"}
                  />
                  <SidebarSubLink
                    href="/dosen/approval"
                    label="Approval Bimbingan"
                    active={pathname === "/dosen/approval"}
                  />
                  <SidebarSubLink
                    href="/dosen/kelayakan-pembimbing"
                    label="Kelayakan Pembimbing"
                    active={pathname === "/dosen/kelayakan-pembimbing"}
                  />
                  <SidebarSubLink
                    href="/dosen/penawaran-topik"
                    label="Penawaran Topik"
                    active={pathname === "/dosen/penawaran-topik"}
                  />
                </>
              ) : (
                <>
                  <SidebarSubLink
                    href="/mahasiswa/list-topik"
                    label="List Topik KP"
                    active={pathname === "/mahasiswa/list-topik"}
                  />

                  <SidebarSubLink
                    href="/mahasiswa/jadwal-bimbingan"
                    label="Jadwal Bimbingan"
                    active={pathname === "/mahasiswa/jadwal-bimbingan"}
                  />
                </>
              )}
            </div>
          </div>

          {/* DOKUMEN SECTION (Only Mahasiswa) */}
          {isMahasiswa && (
            <div className="space-y-2">
              <div
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300
                  ${
                    isDokumenActive
                      ? "bg-[#EAF4FB]/70 text-[#355872] font-semibold border-l-4 border-[#355872] pl-2.5 shadow-sm"
                      : "text-[#355872]/80 font-medium pl-3"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} className={isDokumenActive ? "text-[#355872]" : ""} />
                  <span className="text-xs uppercase tracking-wider font-bold">Dokumen KP</span>
                </div>
              </div>

              <div className="mt-1 ml-1 space-y-1.5">
                <SidebarSubLink
                  href="/mahasiswa/upload-laporan"
                  label="Upload Laporan KP"
                  active={pathname === "/mahasiswa/upload-laporan"}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer / User Info & Logout */}
      <div className="p-4 border-t border-[#f0f5fa] bg-white flex flex-col gap-3">
        {/* User profile card */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-full bg-[#EAF4FB] text-[#355872] flex items-center justify-center font-bold text-sm shadow-inner uppercase">
            {role.substring(0, 2)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Logged in as</p>
            <p className="text-sm font-bold text-[#355872] truncate capitalize">{role}</p>
          </div>
        </div>

        {/* Premium Logout Button */}
        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            bg-red-50
            hover:bg-red-100
            text-red-600
            hover:text-red-700
            font-bold
            text-sm
            transition-all
            duration-200
            cursor-pointer
            border
            border-red-100
          "
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const role: SidebarRole = pathname.startsWith("/dosen")
    ? "dosen"
    : pathname.startsWith("/admin")
    ? "admin"
    : pathname.startsWith("/koordinator")
    ? "koordinator"
    : "mahasiswa";

  return <SidebarContent role={role} />;
}
