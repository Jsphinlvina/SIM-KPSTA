"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, UserCheck } from "lucide-react";
import api from "../../api";

const ROLE_DISPLAY: Record<string, string> = {
  mahasiswa: "Mahasiswa",
  dosen: "Dosen",
  koordinator: "Koor KP",
  kaprodi: "Kaprodi",
  admin: "Admin",
};

const DISPLAY_TO_ROLE: Record<string, string> = {
  Mahasiswa: "mahasiswa",
  Dosen: "dosen",
  "Koor KP": "koordinator",
  Kaprodi: "kaprodi",
  Admin: "admin",
};

const availableRoles = ["Mahasiswa", "Dosen", "Koor KP", "Kaprodi", "Admin"];

interface PendingUser {
  user_id: number;
  nim_nip: string;
  nama_lengkap: string;
  email: string;
  role: string;
}

export default function PendingUsersPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRoles, setEditRoles] = useState<Record<number, string>>({});
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api.get("/auth/users/pending/")
      .then((res) => {
        const data: PendingUser[] = res.data.data || [];
        setUsers(data);
        const roles: Record<number, string> = {};
        data.forEach((u) => {
          roles[u.user_id] = ROLE_DISPLAY[u.role] ?? "Mahasiswa";
        });
        setEditRoles(roles);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (userId: number) => {
    setApprovingId(userId);
    const selectedDisplayRole = editRoles[userId];
    const roleValue = DISPLAY_TO_ROLE[selectedDisplayRole] ?? "mahasiswa";
    try {
      await api.post(`/auth/users/${userId}/approve/`, { role: roleValue });
      setUsers((prev) => prev.filter((u) => u.user_id !== userId));
      showToast("Akun berhasil disetujui.", true);
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Gagal menyetujui akun.", false);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0]">
      <div className="p-10 flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">Akun Menunggu Persetujuan</h1>
            <p className="text-gray-500 mt-2">
              Tinjau pendaftaran baru, ubah role jika diperlukan, lalu setujui.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-12 text-center text-gray-500">
            Tidak ada akun yang menunggu persetujuan.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#e6eef5] overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-[80px_180px_1fr_1fr_1.5fr_140px] bg-[#EAF4FB] px-8 py-5 font-semibold text-[#355872]">
              <div>No</div>
              <div>NIM / NIP</div>
              <div>Nama</div>
              <div>Email</div>
              <div>Role</div>
              <div>Aksi</div>
            </div>

            {users.map((user, index) => (
              <div
                key={user.user_id}
                className="grid grid-cols-[80px_180px_1fr_1fr_1.5fr_140px] items-center px-8 py-5 border-t border-[#eef4f8]"
              >
                <div className="text-[#355872]">{index + 1}</div>
                <div className="text-[#355872] font-medium">{user.nim_nip}</div>
                <div className="font-semibold text-[#355872]">{user.nama_lengkap}</div>
                <div className="text-sm text-gray-500">{user.email}</div>

                {/* Role selector — admin can fix wrong role before approving */}
                <div>
                  <select
                    value={editRoles[user.user_id] ?? "Mahasiswa"}
                    onChange={(e) =>
                      setEditRoles((prev) => ({ ...prev, [user.user_id]: e.target.value }))
                    }
                    className="px-4 py-2 rounded-xl border border-[#dbe9f4] text-[#355872] outline-none bg-white text-sm"
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {user.role && ROLE_DISPLAY[user.role] !== editRoles[user.user_id] && (
                    <p className="text-xs text-amber-600 mt-1">
                      Didaftarkan sebagai: {ROLE_DISPLAY[user.role] ?? user.role}
                    </p>
                  )}
                </div>

                {/* Approve button */}
                <div>
                  <button
                    onClick={() => handleApprove(user.user_id)}
                    disabled={approvingId === user.user_id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition disabled:opacity-60 cursor-pointer"
                  >
                    {approvingId === user.user_id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <UserCheck size={16} />
                    )}
                    Setujui
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-10 z-50">
          <div
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg text-white text-sm font-medium ${
              toast.ok ? "bg-[#355872]" : "bg-red-500"
            }`}
          >
            <CheckCircle2 size={18} />
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
