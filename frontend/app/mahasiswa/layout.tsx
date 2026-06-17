"use client";

import Sidebar from "@/app/components/sidebar";
import RoleGuard from "@/app/components/role-guard";

export default function MahasiswaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard role="mahasiswa">
      <div className="flex h-screen bg-[#F7F8F0] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </RoleGuard>
  );
}

