import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMitra,
  createMitra,
  updateMitra,
  deleteMitra,
  approveMitra,
  rejectMitra,
} from "../service/mitra-service";
import type { MitraPayload } from "../../types/mitra";
import { toast } from "sonner"; // Assuming sonner is used
import { addMitraQuick, searchMitra } from "~/service/logbook-service";
import { useAddActivity } from "./use-helper";

export const useGetMitra = (
  page: number,
  search: string,
  perPage: number = 10,
  klasifikasi: string = "all",
  status: string = "approved",
) => {
  return useQuery({
    queryKey: ["mitra", page, search, perPage, klasifikasi, status],
    queryFn: () => getMitra(page, search, perPage, klasifikasi, status),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });
};

export const useCreateMitra = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();
  return useMutation({
    mutationFn: (payload: MitraPayload) => createMitra(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mitra"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Mitra berhasil ditambahkan");
      logActivity({
        action: "Tambah Mitra",
        description: `Menambahkan mitra "${data.data.nama}"`,
        type: "Mitra",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan mitra");
    },
  });
};

export const useUpdateMitra = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<MitraPayload>;
    }) => updateMitra(id, payload),
    onMutate: async (newMitra) => {
      await queryClient.cancelQueries({ queryKey: ["mitra"] });
      const previousMitra = queryClient.getQueriesData({ queryKey: ["mitra"] });

      queryClient.setQueriesData({ queryKey: ["mitra"] }, (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((item: any) =>
              item.id === newMitra.id ? { ...item, ...newMitra.payload } : item,
            ),
          },
        };
      });

      return { previousMitra };
    },
    onSuccess: (data) => {
      toast.success("Mitra berhasil diperbarui");
      logActivity({
        action: "Edit Mitra",
        description: `Memperbarui mitra "${data.data.nama}"`,
        type: "Mitra",
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousMitra) {
        context.previousMitra.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      toast.error(error.response?.data?.message || "Gagal memperbarui mitra");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mitra"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};

export const useDeleteMitra = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();
  return useMutation({
    mutationFn: ({ id, nama }: { id: number; nama: string }) => deleteMitra(id),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["mitra"] });
      const previousMitra = queryClient.getQueriesData({ queryKey: ["mitra"] });

      queryClient.setQueriesData({ queryKey: ["mitra"] }, (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.filter((item: any) => item.id !== variables.id),
            total: old.data.total - 1,
          },
        };
      });

      return { previousMitra };
    },
    onSuccess: (_, variables) => {
      toast.success("Mitra berhasil dihapus");
      logActivity({
        action: "Hapus Mitra",
        description: `Menghapus mitra "${variables.nama}" dengan ID ${variables.id}`,
        type: "Mitra",
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousMitra) {
        context.previousMitra.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      toast.error(error.response?.data?.message || "Gagal menghapus mitra");
    },
  });
};

export const useApproveMitra = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();
  return useMutation({
    mutationFn: ({ id, nama }: { id: number; nama: string }) =>
      approveMitra(id),
    onSuccess: (_, variables) => {
      toast.success("Mitra berhasil disetujui");
      // Invalidate both lists (approved and pending)
      queryClient.invalidateQueries({ queryKey: ["mitra"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      logActivity({
        action: "Approve Mitra",
        description: `Menyetujui mitra "${variables.nama}"`,
        type: "Mitra",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menyetujui mitra");
    },
  });
};

export const useRejectMitra = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();
  return useMutation({
    mutationFn: ({ id, nama }: { id: number; nama: string }) => rejectMitra(id),
    onSuccess: (_, variables) => {
      toast.success("Mitra ditolak/dihapus");
      queryClient.invalidateQueries({ queryKey: ["mitra"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      logActivity({
        action: "Reject Mitra",
        description: `Menolak mitra "${variables.nama}"`,
        type: "Mitra",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menolak mitra");
    },
  });
};

export const useSearchMitra = (query: string) => {
  return useQuery({
    queryKey: ["mitra-search", query],
    queryFn: () => searchMitra(query),
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddMitraQuick = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: addMitraQuick,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mitra-search"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      logActivity({
        action: "Tambah Mitra",
        description: `Menambahkan mitra "${data.data.nama}" (Cepat)`,
        type: "Mitra",
      });
    },
  });
};
