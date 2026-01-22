import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMitra,
  createMitra,
  updateMitra,
  deleteMitra,
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
) => {
  return useQuery({
    queryKey: ["mitra", page, search, perPage, klasifikasi],
    queryFn: () => getMitra(page, search, perPage, klasifikasi),
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mitra"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Mitra berhasil diperbarui");
      logActivity({
        action: "Edit Mitra",
        description: `Memperbarui mitra "${data.data.nama}"`,
        type: "Mitra",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui mitra");
    },
  });
};

export const useDeleteMitra = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();
  return useMutation({
    mutationFn: (id: number) => deleteMitra(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mitra"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Mitra berhasil dihapus");
      logActivity({
        action: "Hapus Mitra",
        description: `Menghapus mitra dengan ID ${variables}`,
        type: "Mitra",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus mitra");
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
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      logActivity({
        action: "Tambah Mitra",
        description: `Menambahkan mitra "${data.data.nama}" (Cepat)`,
        type: "Mitra",
      });
    },
  });
};
