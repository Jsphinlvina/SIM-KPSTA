"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, KeyRound, Loader2, AlertTriangle } from "lucide-react";
import { ChevronDown } from "lucide-react";
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

interface UserRow {
  id: number;
  nip: string;
  nama: string;
  role: string;
  displayRole: string;
  isActive: boolean;
}

type ModalAction = "accept" | "reject" | "reset";

interface ModalState {
  action: ModalAction;
  user: UserRow;
}

const MODAL_CONFIG: Record<ModalAction, { title: string; confirmLabel: string; confirmClass: string }> = {
  accept: {
    title: "Terima Akun",
    confirmLabel: "Ya, Terima",
    confirmClass: "bg-green-600 hover:bg-green-500",
  },
  reject: {
    title: "Tolak Akun",
    confirmLabel: "Ya, Tolak",
    confirmClass: "bg-red-500 hover:bg-red-400",
  },
  reset: {
    title: "Reset Password",
    confirmLabel: "Ya, Reset",
    confirmClass: "bg-amber-500 hover:bg-amber-400",
  },
};

export default function UserPage() {
  const [filterRole, setFilterRole] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState<string>("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  useEffect(() => {
    api
      .get("/auth/users/")
      .then((res) => {
        const data: any[] = res.data.data || [];
        setUsers(
          data.map((u) => ({
            id: u.user_id,
            nip: u.nim_nip,
            nama: u.nama_lengkap,
            role: u.role || "",
            displayRole: ROLE_DISPLAY[u.role] ?? u.role ?? "—",
            isActive: u.is_active,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((user) => {
    if (!filterRole) return true;
    if (filterRole === "No Role") return !user.role;
    return user.displayRole === filterRole;
  });

  const handleAccept = async (user: UserRow) => {
    setSavingId(user.id);
    try {
      await api.post(`/auth/users/${user.id}/approve/`, { role: user.role });
      setUsers((prev) =>
        prev.map((u) => u.id === user.id ? { ...u, isActive: true } : u)
      );
    } catch (err) {
      console.error("Gagal menyetujui akun:", err);
    } finally {
      setSavingId(null);
    }
  };

  const handleReject = async (userId: number) => {
    setRejectingId(userId);
    try {
      await api.delete(`/auth/users/${userId}/`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Gagal menolak akun:", err);
    } finally {
      setRejectingId(null);
    }
  };

  const handleResetPassword = async (userId: number) => {
    setResettingId(userId);
    try {
      await api.post(`/auth/users/${userId}/reset-password/`);
    } catch (err) {
      console.error("Gagal reset password:", err);
    } finally {
      setResettingId(null);
    }
  };

  const handleConfirm = async () => {
    if (!modal) return;
    const { action, user } = modal;
    setModal(null);
    if (action === "accept") await handleAccept(user);
    else if (action === "reject") await handleReject(user.id);
    else if (action === "reset") await handleResetPassword(user.id);
  };

  const handleEdit = (user: UserRow) => {
    setEditingId(user.id);
    setEditRole(ROLE_DISPLAY[user.role] ?? "");
  };

  const handleSave = async (userId: number) => {
    setSavingId(userId);
    const newRoleValue = DISPLAY_TO_ROLE[editRole] ?? "";
    try {
      await api.put(`/auth/users/${userId}/`, { role: newRoleValue });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, role: newRoleValue, displayRole: ROLE_DISPLAY[newRoleValue] ?? newRoleValue }
            : u
        )
      );
    } catch (err) {
      console.error("Gagal memperbarui role:", err);
    } finally {
      setSavingId(null);
      setEditingId(null);
    }
  };

  const modalConfig = modal ? MODAL_CONFIG[modal.action] : null;

  return (
    <div className="min-h-screen bg-[#F7F8F0]">
      <div className="p-10 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">Daftar User</h1>
            <p className="text-gray-500 mt-2">Kelola role pengguna sistem</p>
          </div>

          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="appearance-none px-4 py-3 pr-12 rounded-xl border border-[#d9e6f0] bg-white text-[#355872] outline-none"
            >
              <option value="">All Role</option>
              {availableRoles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
              <option value="No Role">No Role</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#355872]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-[#e6eef5] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-[80px_180px_1fr_1.5fr_220px] bg-[#EAF4FB] px-8 py-5 font-semibold text-[#355872]">
            <div>No</div>
            <div>NIM / NIP</div>
            <div>Nama</div>
            <div>Role</div>
            <div>Aksi</div>
          </div>

          {loading ? (
            <div className="py-14 flex justify-center text-gray-400">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : (
            filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className="grid grid-cols-[80px_180px_1fr_1.5fr_220px] items-center px-8 py-5 border-t border-[#eef4f8]"
              >
                <div className="text-[#355872]">{index + 1}</div>
                <div className="text-[#355872]">{user.nip}</div>
                <div className="font-medium text-[#355872]">{user.nama}</div>

                {/* Role — show select when editing */}
                <div>
                  {editingId === user.id ? (
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="px-4 py-2 rounded-xl border border-[#dbe9f4] text-[#355872] outline-none bg-white text-sm"
                    >
                      <option value="">— Pilih Role —</option>
                      {availableRoles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.role ? (
                        <span className="px-3 py-1 rounded-full bg-[#EAF4FB] text-[#355872] text-sm">
                          {user.displayRole}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm">
                          No Role
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Aksi */}
                <div className="flex gap-2">
                  {!user.isActive ? (
                    <>
                      <button
                        onClick={() => setModal({ action: "accept", user })}
                        disabled={savingId === user.id}
                        title="Terima"
                        className="w-10 h-10 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white flex items-center justify-center transition"
                      >
                        {savingId === user.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => setModal({ action: "reject", user })}
                        disabled={rejectingId === user.id}
                        title="Tolak"
                        className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white flex items-center justify-center transition"
                      >
                        {rejectingId === user.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <X size={18} />
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          if (editingId === user.id) {
                            handleSave(user.id);
                          } else {
                            handleEdit(user);
                          }
                        }}
                        disabled={savingId === user.id}
                        title={editingId === user.id ? "Simpan" : "Edit Role"}
                        className="w-10 h-10 rounded-xl bg-[#355872] hover:bg-[#7AAACE] disabled:opacity-60 text-white flex items-center justify-center transition"
                      >
                        {savingId === user.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : editingId === user.id ? (
                          <Check size={18} />
                        ) : (
                          <Pencil size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => setModal({ action: "reset", user })}
                        disabled={resettingId === user.id}
                        title="Reset Password"
                        className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white flex items-center justify-center transition"
                      >
                        {resettingId === user.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <KeyRound size={18} />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}

          {!loading && filteredUsers.length === 0 && (
            <div className="py-12 text-center text-gray-500">Tidak ada data user.</div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {modal && modalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#355872]">{modalConfig.title}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {modal.action === "accept" && (
                    <>Terima akun <span className="font-semibold text-[#355872]">{modal.user.nama}</span>? Pengguna akan dapat login ke sistem.</>
                  )}
                  {modal.action === "reject" && (
                    <>Tolak dan hapus akun <span className="font-semibold text-[#355872]">{modal.user.nama}</span>? Tindakan ini tidak dapat dibatalkan.</>
                  )}
                  {modal.action === "reset" && (
                    <>Reset password <span className="font-semibold text-[#355872]">{modal.user.nama}</span> ke <span className="font-mono font-semibold">password123</span>?</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModal(null)}
                className="px-5 py-2.5 rounded-xl border border-[#d9e6f0] text-[#355872] hover:bg-[#EAF4FB] transition text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className={`px-5 py-2.5 rounded-xl text-white text-sm font-medium transition ${modalConfig.confirmClass}`}
              >
                {modalConfig.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
