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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast.success("Unit berhasil diperbarui!");
      logActivity({
        action: "Edit Unit",
        description: `Memperbarui unit "${data.data.nama}"`,
        type: "Unit",
      });
    },
    onError: (error: any) => {
      toast.error(
        "Gagal memperbarui unit: " +
          (error.response?.data?.message || "Terjadi kesalahan"),
      );
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: ({ id, nama }: { id: number; nama: string }) =>
      deleteUnit({ id }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast.success("Unit berhasil dihapus!");
      logActivity({
        action: "Hapus Unit",
        description: `Menghapus unit "${variables.nama}" (ID: ${variables.id})`,
        type: "Unit",
      });
    },
    onError: (error: any) => {
      toast.error(
        "Gagal menghapus unit: " + (error.message || "Terjadi kesalahan"),
      );
    },
  });
};
