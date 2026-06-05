"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Check } from "lucide-react";
import { ChevronDown } from "lucide-react";

export default function UserPage() {
  const availableRoles = [
    "Mahasiswa",
    "Dosen",
    "Koor KP",
    "Admin",
  ];

  const [filterRole, setFilterRole] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      nip: "2272004",
      nama: "Jessica Luwia",
      roles: ["Mahasiswa"],
    },
    {
      id: 2,
      nip: "19871201",
      nama: "Meliana",
      roles: ["Dosen", "Koor KP"],
    },
    {
      id: 3,
      nip: "-",
      nama: "Admin 1",
      roles: ["Admin"],
    },
    {
      id: 4,
      nip: "2272010",
      nama: "User Baru",
      roles: [],
    },
  ]);

  const filteredUsers = users.filter((user) => {
    if (!filterRole) return true;

    if (filterRole === "No Role") {
      return user.roles.length === 0;
    }

    return user.roles.includes(filterRole);
  });

  const handleRoleChange = (
    userId: number,
    role: string,
    checked: boolean
  ) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;

        return {
          ...user,
          roles: checked
            ? [...user.roles, role]
            : user.roles.filter((r) => r !== role),
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0]">
      <div className="p-10 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
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
                Kelola role pengguna sistem
              </p>
            </div>
          </div>

          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="
                appearance-none
                px-4
                py-3
                pr-12
                rounded-xl
                border
                border-[#d9e6f0]
                bg-white
                text-[#355872]
                outline-none
              "
            >
              <option value="">All Role</option>
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Dosen">Dosen</option>
              <option value="Koor KP">Koor KP</option>
              <option value="Admin">Admin</option>
              <option value="No Role">No Role</option>
            </select>

            <ChevronDown
              size={18}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                pointer-events-none
                text-[#355872]
              "
            />
          </div>
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
          {/* Header */}
          <div
            className="
              grid
              grid-cols-[80px_180px_1fr_1.5fr_100px]
              bg-[#EAF4FB]
              px-8
              py-5
              font-semibold
              text-[#355872]
            "
          >
            <div>No</div>
            <div>NIP / NRP</div>
            <div>Nama</div>
            <div>Role</div>
            <div>Aksi</div>
          </div>

          {/* Body */}
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              className="
                grid
                grid-cols-[80px_180px_1fr_1.5fr_100px]
                items-center
                px-8
                py-5
                border-t
                border-[#eef4f8]
              "
            >
              {/* No */}
              <div className="text-[#355872]">
                {index + 1}
              </div>

              {/* NIP */}
              <div className="text-[#355872]">
                {user.nip}
              </div>

              {/* Nama */}
              <div className="font-medium text-[#355872]">
                {user.nama}
              </div>

              {/* Role */}
              <div>
                {editingId === user.id ? (
                  <div className="flex flex-wrap gap-4">
                    {availableRoles.map((role) => (
                      <label
                        key={role}
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-[#355872]
                        "
                      >
                        <input
                          type="checkbox"
                          checked={user.roles.includes(role)}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              role,
                              e.target.checked
                            )
                          }
                        />
                        {role}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <span
                          key={role}
                          className="
                            px-3
                            py-1
                            rounded-full
                            bg-[#EAF4FB]
                            text-[#355872]
                            text-sm
                          "
                        >
                          {role}
                        </span>
                      ))
                    ) : (
                      <span
                        className="
                          px-3
                          py-1
                          rounded-full
                          bg-red-100
                          text-red-600
                          text-sm
                        "
                      >
                        No Role
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Aksi */}
              <div>
                <button
                  onClick={() => {
                    if (editingId === user.id) {
                      setEditingId(null);
                    } else {
                      setEditingId(user.id);
                    }
                  }}
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-[#355872]
                    hover:bg-[#7AAACE]
                    text-white
                    flex
                    items-center
                    justify-center
                    transition
                  "
                >
                  {editingId === user.id ? (
                    <Check size={18} />
                  ) : (
                    <Pencil size={18} />
                  )}
                </button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              Tidak ada data user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}