"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ModalAdd from "./modal-add";
import Link from "next/link";
import { Upload, ArrowLeft } from "lucide-react";

export default function UserPage() {
  const [openModal, setOpenModal] = useState(false);

  const users = [
    {
      id: 1,
      nama: "Jessica Luwia",
      role: "Mahasiswa",
    },
    {
      id: 2,
      nama: "Meliana",
      role: "Dosen",
    },
    {
      id: 3,
      nama: "Admin 1",
      role: "Admin",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8F0] p-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 mb-10">
        <Link 
          href="/admin" 
          className="
            mt-1 
            p-2 
            rounded-full 
            hover:bg-[#EAF4FB] 
            transition 
            text-[#355872]
          "
        >
          <ArrowLeft size={32} />
        </Link>

        <div>
          <h1 className="text-4xl font-bold text-[#355872]">
            Daftar User
          </h1>
          <p className="text-gray-500 mt-2">
            Kelola data user
          </p>
        </div>
      </div>

        {/* Add User */}
        <button
          onClick={() => setOpenModal(true)}
          className="
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-2xl
            bg-[#355872]
            hover:bg-[#7AAACE]
            text-white
            transition
            shadow-md
            cursor-pointer
          "
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Table */}
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-[#e6eef5]
          overflow-hidden
          shadow-sm
        "
      >
        {/* Table Header */}
        <div
          className="
            grid
            grid-cols-4
            bg-[#EAF4FB]
            px-8
            py-5
            font-semibold
            text-[#355872]
          "
        >
          <div>No</div>
          <div>Nama</div>
          <div>Role</div>
          <div>Aksi</div>
        </div>

        {/* Table Body */}
        <div>
          {users.map((user) => (
            <div
              key={user.id}
              className="
                grid
                grid-cols-4
                items-center
                px-8
                py-5
                border-t
                border-[#eef4f8]
                text-[#355872]
              "
            >
              <div>{user.id}</div>

              <div>{user.nama}</div>

              <div>
                <span
                  className="
                    px-4
                    py-2
                    rounded-full
                    text-sm
                  "
                >
                  {user.role}
                </span>
              </div>

              {/* Action */}
              <div className="flex items-center gap-3">
                {/* Edit */}
                <button
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-[#355872]
                    hover:bg-[#7AAACE]
                    text-white
                    text-sm
                    transition
                    cursor-pointer
                  "
                >
                  Edit
                </button>

                {/* Delete */}
                <button
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    text-sm
                    transition
                    cursor-pointer
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <ModalAdd
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </div>
  );
}