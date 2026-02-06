import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import {
  getStatuses,
  addStatus,
  updateStatus,
  deleteStatus,
  type StatusesResponse,
} from "~/service/status-service";
import { toast } from "sonner";
import { useAddActivity } from "./use-helper";

export const useStatuses = (
  page: number,
  search: string = "",
  perPage: number = 10,
) => {
  return useQuery<StatusesResponse>({
    queryKey: ["statuses", page, search, perPage],
    queryFn: () => getStatuses(page, search, perPage),
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });
};

export const useAddStatus = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: addStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] });
      toast.success("Status berhasil ditambahkan!");
      logActivity({
        action: "Tambah Status",
        description: `Menambahkan status "${data.data.nama}"`,
        type: "Status",
      });
    },
    onError: (error: any) => {
      toast.error(
        "Gagal menambah status: " + (error.message || "Terjadi kesalahan"),
      );
    },
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: updateStatus,
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ["statuses"] });
      const previousStatuses = queryClient.getQueriesData({
        queryKey: ["statuses"],
      });

      queryClient.setQueriesData({ queryKey: ["statuses"] }, (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((item: any) =>
              item.id === newStatus.id ? { ...item, ...newStatus.data } : item,
            ),
          },
        };
      });

      return { previousStatuses };
    },
    onSuccess: (data) => {
      toast.success("Status berhasil diperbarui!");
      logActivity({
        action: "Edit Status",
        description: `Memperbarui status "${data.data.nama}"`,
        type: "Status",
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousStatuses) {
        context.previousStatuses.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      toast.error(
        "Gagal memperbarui status: " +
          (error.response?.data?.message || "Terjadi kesalahan"),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] });
    },
  });
};

export const useDeleteStatus = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: ({ id, nama }: { id: number; nama: string }) =>
      deleteStatus({ id }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["statuses"] });
      const previousStatuses = queryClient.getQueriesData({
        queryKey: ["statuses"],
      });

      queryClient.setQueriesData({ queryKey: ["statuses"] }, (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.filter((item: any) => item.id !== variables.id),
            meta: {
              ...old.data.meta,
              total: old.data.meta ? old.data.meta.total - 1 : 0,
            },
          },
        };
      });

      return { previousStatuses };
    },
    onSuccess: (_, variables) => {
      toast.success("Status berhasil dihapus!");
      logActivity({
        action: "Hapus Status",
        description: `Menghapus status "${variables.nama}" (ID: ${variables.id})`,
        type: "Status",
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousStatuses) {
        context.previousStatuses.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      toast.error(
        "Gagal menghapus status: " + (error.message || "Terjadi kesalahan"),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] });
    },
  });
};
