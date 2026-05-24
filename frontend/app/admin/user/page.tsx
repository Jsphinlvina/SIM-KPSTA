"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import { Plus, X } from "lucide-react";

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
    <div className="flex min-h-screen bg-[#F7F8F0]">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">
              Daftar User
            </h1>

            <p className="text-gray-500 mt-2">
              Kelola data user
            </p>
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
      </div>

      {/* MODAL */}
      {openModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-50
          "
        >
          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-3xl
              p-8
              shadow-2xl
              relative
            "
          >
            {/* Close */}
            <button
              onClick={() => setOpenModal(false)}
              className="
                absolute
                right-5
                top-5
                text-gray-400
                hover:text-black
                cursor-pointer
              "
            >
              <X size={22} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-[#355872] mb-8">
              Add User
            </h2>

            {/* Form */}
            <form className="space-y-6">
              {/* Nama */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[#355872]">
                  Nama
                </label>

                <input
                  type="text"
                  placeholder="Input nama user"
                  className="
                    w-full
                    h-12
                    rounded-xl
                    border
                    border-[#9CD5FF]
                    px-4
                    outline-none
                    focus:ring-2
                    focus:ring-[#7AAACE]
                  "
                />
              </div>

              {/* Role */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[#355872]">
                  Role
                </label>

                <select
                  className="
                    w-full
                    h-12
                    rounded-xl
                    border
                    border-[#9CD5FF]
                    px-4
                    outline-none
                    focus:ring-2
                    focus:ring-[#7AAACE]
                    bg-white
                  "
                >
                  <option>Mahasiswa</option>
                  <option>Dosen</option>
                  <option>Admin</option>
                </select>
              </div>

              {/* Button */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="
                    px-5
                    py-2
                    rounded-xl
                    border
                    border-[#dbe9f4]
                    text-gray-600
                    hover:bg-gray-100
                    cursor-pointer
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    px-5
                    py-2
                    rounded-xl
                    bg-[#355872]
                    hover:bg-[#7AAACE]
                    text-white
                    transition
                    cursor-pointer
                  "
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}