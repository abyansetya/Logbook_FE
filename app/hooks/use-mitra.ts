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

export const useGetMitra = (page: number, search: string) => {
  return useQuery({
    queryKey: ["mitra", page, search],
    queryFn: () => getMitra(page, search),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });
};

export const useCreateMitra = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MitraPayload) => createMitra(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mitra"] });
      toast.success("Mitra berhasil ditambahkan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan mitra");
    },
  });
};

export const useUpdateMitra = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<MitraPayload>;
    }) => updateMitra(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mitra"] });
      toast.success("Mitra berhasil diperbarui");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui mitra");
    },
  });
};

export const useDeleteMitra = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMitra(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mitra"] });
      toast.success("Mitra berhasil dihapus");
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

  return useMutation({
    mutationFn: addMitraQuick,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mitra-search"] });
    },
  });
};
