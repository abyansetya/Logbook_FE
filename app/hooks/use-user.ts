import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUsers,
  searchUser,
  updateUserRole,
  deleteUser,
} from "~/service/user-service";
import { useAddActivity } from "./use-helper";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchUser = (query: string) => {
  return useQuery({
    queryKey: ["user-search", query],
    queryFn: () => searchUser(query),
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      updateUserRole(userId, role),

    // Logika Optimistik: Jalankan SEBELUM request server selesai
    onMutate: async (newUpdate) => {
      // 1. Batalkan refetch yang sedang berjalan agar tidak menimpa state optimistik
      await queryClient.cancelQueries({ queryKey: ["users"] });
      await queryClient.cancelQueries({ queryKey: ["user-search"] });

      // 2. Simpan snapshot data lama (untuk rollback jika error)
      const previousUsers = queryClient.getQueryData(["users"]);
      const previousSearch = queryClient.getQueryData(["user-search"]);

      // 3. Update cache secara instan (Optimistic)
      const updater = (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((user: any) =>
            user.id === newUpdate.userId
              ? { ...user, roles: [newUpdate.role] }
              : user,
          ),
        };
      };

      queryClient.setQueryData(["users"], updater);
      queryClient.setQueryData(["user-search"], updater);

      // 4. Kembalikan context agar onError bisa melakukan rollback
      return { previousUsers, previousSearch };
    },
    onSuccess: (_, variables) => {
      toast.success("Role berhasil diubah!");
      logActivity({
        action: "Edit User",
        description: `Mengubah role user ID ${variables.userId} menjadi ${variables.role}`,
        type: "User",
      });
    },

    // Jika server merespon error, kembalikan data ke snapshot awal
    onError: (err, newUpdate, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
      if (context?.previousSearch) {
        queryClient.setQueryData(["user-search"], context.previousSearch);
      }
      alert("Gagal mengubah role pengguna.");
    },

    // Selalu sinkronkan dengan server (refetch) setelah selesai
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-search"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-search"] });
      toast.success("User berhasil dihapus");
      logActivity({
        action: "Hapus User",
        description: `Menghapus user ID ${userId}`,
        type: "User",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus user");
    },
  });
};
