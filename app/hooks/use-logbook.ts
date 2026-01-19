import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import {
  getLogbooks,
  getLogbookDetail,
  addDokumen,
  searchDocument,
  editDokumen,
  deleteDokumen,
  addLog,
  editLog,
  deleteLog,
} from "~/service/logbook-service";
import type {
  LogbooksResponse,
  LogbookDetailResponse,
} from "../../types/logbook";
import { toast } from "sonner";

import type { updateLogData } from "~/lib/schema";

// Hook untuk list logbook
export const useLogbooks = (
  page: number,
  search: string = "",
  perPage: number = 10,
) => {
  return useQuery<LogbooksResponse>({
    queryKey: ["logbooks", page, search, perPage],
    queryFn: () => getLogbooks(page, search, perPage),
    // Di TanStack Query v5, gunakan placeholderData: keepPreviousData
    placeholderData: keepPreviousData,
    staleTime: 30000, // Data dianggap segar selama 30 detik
  });
};

// Hook untuk detail logbook
export const useLogbookDetail = (id: number | null) => {
  return useQuery<LogbookDetailResponse>({
    queryKey: ["logbook-detail", id],
    queryFn: () => getLogbookDetail(id!),
    enabled: !!id, // Hanya jalan jika id ada (bukan 0 atau null)
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddDokumen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDokumen,
    onSuccess: () => {
      // Refresh list logbook agar dokumen baru langsung muncul di tabel
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Dokumen berhasil ditambahkan!");
    },
    onError: (error: any) => {
      toast.error(
        "Gagal menambah dokumen: " + (error.message || "Terjadi kesalahan"),
      );
    },
  });
};

export const useAddLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLog,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });
      queryClient.invalidateQueries({
        queryKey: ["logbook-detail", variables.dokumen_id],
      });

      toast.success("Log aktivitas berhasil ditambahkan!");
    },
    onError: (error: any) => {
      toast.error(
        "Gagal menambah log: " +
          (error.response?.data?.message ||
            error.message ||
            "Terjadi kesalahan"),
      );
    },
  });
};

export const useSearchDocument = (query: string) => {
  return useQuery({
    queryKey: ["document-search", query],
    queryFn: () => searchDocument(query),
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook untuk edit dokumen
export const useEditDokumen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Sekarang mutationFn menerima objek yang berisi id dan data
    mutationFn: editDokumen,
    onSuccess: (response, variables) => {
      // Invalidate list utama
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });

      // Invalidate detail spesifik dokumen yang baru diedit
      queryClient.invalidateQueries({
        queryKey: ["logbook-detail", variables.id],
      });

      toast.success("Dokumen berhasil diperbarui!");
    },
    onError: (error: any) => {
      toast.error(
        "Gagal memperbarui dokumen: " + (error.message || "Terjadi kesalahan"),
      );
    },
  });
};

export const useEditLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * mutationFn:
     * Menyesuaikan dengan fungsi editLog di service yang menerima
     * satu objek tunggal berisi { id, data }.
     */
    mutationFn: (variables: {
      id: number;
      dokumen_id: number;
      data: updateLogData;
    }) => editLog({ id: variables.id, data: variables.data }),

    onSuccess: (response, variables) => {
      // 1. Refresh list logbook utama (Tabel besar)
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });

      // 2. Refresh detail dokumen spesifik agar log terbaru muncul
      // 'dokumen_id' dikirim melalui mutate() untuk kebutuhan cache invalidation di frontend
      if (variables.dokumen_id) {
        queryClient.invalidateQueries({
          queryKey: ["logbook-detail", variables.dokumen_id],
        });
      }

      toast.success("Log aktivitas berhasil diperbarui!");
    },
    onError: (error: any) => {
      toast.error(
        "Gagal memperbarui log: " +
          (error.response?.data?.message ||
            error.message ||
            "Terjadi kesalahan"),
      );
    },
  });
};

export const useDeleteDokumen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Kita menerima parameter id di sini
    mutationFn: (id: number) => deleteDokumen({ id }),
    onSuccess: () => {
      // Refresh list agar baris yang dihapus hilang dari tabel
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });

      toast.success("Dokumen berhasil dihapus!");
    },
    onError: (error: any) => {
      toast.error(
        "Gagal menghapus dokumen: " + (error.message || "Terjadi kesalahan"),
      );
    },
  });
};

export const useDeleteLog = (documentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteLog({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });
      // Sekarang documentId sudah tersedia karena dikirim saat inisialisasi hook
      queryClient.invalidateQueries({
        queryKey: ["logbook-detail", documentId],
      });
      toast.success("Log berhasil dihapus!");
    },
  });
};
