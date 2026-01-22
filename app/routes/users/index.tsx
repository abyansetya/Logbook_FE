import { useState, useEffect, useMemo } from "react";
import { useAuth } from "~/provider/auth-context";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { fetchData, updateData, deleteData } from "~/lib/fetch-util";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  Loader2,
  Shield,
  ShieldAlert,
  User as UserIcon,
  Trash,
  Search,
} from "lucide-react";
import { Input } from "~/components/ui/input";

import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "~/hooks/use-debounce";
import {
  useGetUsers,
  useSearchUser,
  useUpdateUserRole,
  useDeleteUser,
} from "~/hooks/use-user";
import type { User } from "../../../types/users";
import ConfirmDeleteModal from "~/components/modal/KonfirmasiDelete";
import { toast } from "sonner";

export default function UsersPage() {
  // --- 1. AUTH & NAVIGATION ---
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/sign-in");
    } else if (user && !user.roles?.includes("Admin")) {
      // Redirect non-Admins
      navigate("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // --- 2. STATES ---
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // --- 3. DATA FETCHING (QUERIES) ---
  const queryClient = useQueryClient();

  // Ambil semua user
  const { data: usersData, isLoading: isAllUsersLoading } = useGetUsers();

  // Ambil hasil pencarian (Hanya jalan jika search >= 3 char)
  const { data: searchResponse, isLoading: isSearchLoading } =
    useSearchUser(debouncedSearch);

  // Mutations
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  // --- 4. COMPUTED LOGIC ---
  const isSearching = debouncedSearch.length >= 3;

  // Tentukan user yang akan ditampilkan di UI
  const displayUsers = useMemo(() => {
    if (isSearching && searchResponse?.success) {
      return (searchResponse?.data as User[]) || [];
    }
    return usersData?.data || [];
  }, [isSearching, searchResponse, usersData]);

  // Status loading untuk UI blokir/overlay
  const isPageLoading =
    authLoading || (isAllUsersLoading && !usersData && !isSearching);

  // --- 5. ACTION HANDLERS ---
  const handleRoleChange = (userId: number, newRole: string) => {
    updateRole.mutate({ userId, role: newRole });
  };

  const handleDeleteClick = (userId: number) => {
    setDeleteConfirmId(userId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    deleteUser.mutate(deleteConfirmId, {
      onSettled: () => {
        setDeleteConfirmId(null);
      },
    });
  };

  // --- 6. HELPERS ---
  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .filter(Boolean) // Menghindari spasi ganda
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // --- 7. RENDER LOADING ---
  if (isPageLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10">
      <div className=" mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Manajemen Pengguna
            </h2>
            <p className="text-slate-500">
              Kelola akses dan role pengguna sistem
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Cari user (min. 3 karakter)..."
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
            <CardDescription>
              {isSearching
                ? `Hasil pencarian: ${displayUsers.length} pengguna`
                : `Total ${displayUsers.length} pengguna terdaftar`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Pengguna</th>
                    <th className="px-4 py-3 font-medium">NIM/NIP</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Bergabung</th>
                    <th className="px-4 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isSearching && isSearchLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <div className="flex justify-center items-center gap-2 text-slate-500">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Mencari pengguna...</span>
                        </div>
                      </td>
                    </tr>
                  ) : displayUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-500"
                      >
                        Tidak ada pengguna ditemukan.
                      </td>
                    </tr>
                  ) : (
                    displayUsers.map((userData) => (
                      <tr key={userData.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-slate-900 text-white text-xs">
                                {getInitials(userData.nama)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">
                                {userData.nama}
                              </p>
                              <p className="text-slate-500 text-xs">
                                {userData.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {userData.nim_nip || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Select
                              disabled={
                                updatingId === userData.id ||
                                userData.id === user?.id
                              }
                              value={userData.roles?.[0]}
                              onValueChange={(val) =>
                                handleRoleChange(userData.id, val)
                              }
                            >
                              <SelectTrigger className="w-[130px] h-8 text-xs">
                                <SelectValue placeholder="Pilih Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Admin">
                                  <div className="flex items-center gap-2">
                                    <ShieldAlert className="w-3 h-3 text-red-500" />
                                    <span>Admin</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Viewer">
                                  <div className="flex items-center gap-2">
                                    <UserIcon className="w-3 h-3 text-blue-500" />
                                    <span>Viewer</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(userData.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            disabled={
                              updatingId === userData.id ||
                              userData.id === user?.id
                            }
                            onClick={() => handleDeleteClick(userData.id)}
                            title="Hapus User"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDeleteModal
        label="pengguna"
        title="Hapus Pengguna?"
        description="Tindakan ini tidak dapat dibatalkan. Data pengguna ini akan dihapus secara permanen dari sistem."
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteUser.isPending}
      />
    </div>
  );
}
