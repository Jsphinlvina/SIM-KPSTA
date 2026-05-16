"use client";

import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  LayoutDashboard,
  FileText,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-white border-r border-[#dbe9f4] shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center overflow-hidden">
        <Image
          src="/text-sim-kp.png"
          alt="Logo"
          width={200}
          height={60}
          className="object-contain -mb-8"
        />
      </div>

      {/* Menu */}
      <div className="p-4 space-y-2">
        {/* Dashboard */}
        <div>
          <div className="flex items-center gap-3 text-[#355872] font-medium px-3 py-2 rounded-lg hover:bg-[#F7F8F0] cursor-pointer transition">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
        </div>

        {/* Category 1 */}
        <div>
          <div className="flex items-center justify-between px-3 py-2 bg-[#EAF4FB] rounded-lg text-[#355872] font-semibold">
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              <span>Category 1</span>
            </div>

            <ChevronDown size={16} />
          </div>

          <div className="mt-2 ml-3 space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-[#F7F8F0] rounded-lg cursor-pointer">
              <ChevronRight size={14} />
              <span>Menu item 1.1</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-[#F7F8F0] rounded-lg cursor-pointer">
              <ChevronRight size={14} />
              <span>Menu item 1.2</span>
            </div>
          </div>
        </div>

        {/* Category 2 */}
        <div>
          <div className="flex items-center justify-between px-3 py-2 text-[#355872] font-semibold hover:bg-[#F7F8F0] rounded-lg cursor-pointer">
            <div className="flex items-center gap-2">
              <FileText size={18} />
              <span>Category 2</span>
            </div>

            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}