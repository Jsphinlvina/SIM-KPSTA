"use client";

import Sidebar from "@/app/components/sidebar";

export default function MahasiswaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#F7F8F0]">
      {children}
    </div>
  );
}

