import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import {
  getUnits,
  addUnit,
  updateUnit,
  deleteUnit,
  type UnitsResponse,
} from "~/service/unit-service";
import { toast } from "sonner";
import { useAddActivity } from "./use-helper";

export const useUnits = (
  page: number,
  search: string = "",
  perPage: number = 10,
) => {
  return useQuery<UnitsResponse>({
    queryKey: ["units", page, search, perPage],
    queryFn: () => getUnits(page, search, perPage),
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });
};

export const useAddUnit = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: addUnit,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast.success("Unit berhasil ditambahkan!");
      logActivity({
        action: "Tambah Unit",
        description: `Menambahkan unit "${data.data.nama}"`,
        type: "Unit",
      });
    },
    onError: (error: any) => {
      toast.error(
        "Gagal menambah unit: " + (error.message || "Terjadi kesalahan"),
      );
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: updateUnit,
    onMutate: async (newUnit) => {
      // Batalakan refetch yang sedang berjalan agar tidak menimpa pembaruan optimistik kita
      await queryClient.cancelQueries({ queryKey: ["units"] });

      // Ambil snapshot data sebelumnya
      const previousUnits = queryClient.getQueriesData({ queryKey: ["units"] });

      // Perbarui cache secara optimistik
      queryClient.setQueriesData({ queryKey: ["units"] }, (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((item: any) =>
              item.id === newUnit.id ? { ...item, ...newUnit.data } : item,
            ),
          },
        };
      });

      return { previousUnits };
    },
    onSuccess: (data) => {
      toast.success("Unit berhasil diperbarui!");
      logActivity({
        action: "Edit Unit",
        description: `Memperbarui unit "${data.data.nama}"`,
        type: "Unit",
      });
    },
    onError: (error: any, _, context) => {
      // Rollback jika terjadi kesalahan
      if (context?.previousUnits) {
        context.previousUnits.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      toast.error(
        "Gagal memperbarui unit: " +
          (error.response?.data?.message || "Terjadi kesalahan"),
      );
    },
    onSettled: () => {
      // Refresh setelah selesai (baik sukses maupun gagal) untuk memastikan sinkronisasi data
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: ({ id, nama }: { id: number; nama: string }) =>
      deleteUnit({ id }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["units"] });

      const previousUnits = queryClient.getQueriesData({ queryKey: ["units"] });

      queryClient.setQueriesData({ queryKey: ["units"] }, (old: any) => {
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

      return { previousUnits };
    },
    onSuccess: (_, variables) => {
      toast.success("Unit berhasil dihapus!");
      logActivity({
        action: "Hapus Unit",
        description: `Menghapus unit "${variables.nama}" (ID: ${variables.id})`,
        type: "Unit",
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousUnits) {
        context.previousUnits.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      toast.error(
        "Gagal menghapus unit: " + (error.message || "Terjadi kesalahan"),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};
