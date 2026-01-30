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
import { useAddActivity } from "./use-helper";

// Hook untuk list logbook
export const useLogbooks = (
  page: number,
  search: string = "",
  perPage: number = 10,
  status: string = "all",
  jenisDokumen: string = "all",
  order: "asc" | "desc" = "desc",
) => {
  return useQuery<LogbooksResponse>({
    queryKey: ["logbooks", page, search, perPage, status, jenisDokumen, order],
    queryFn: () =>
      getLogbooks(page, search, perPage, status, jenisDokumen, order),
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
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: addDokumen,
    onSuccess: (data) => {
      // Refresh list logbook agar dokumen baru langsung muncul di tabel
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Dokumen berhasil ditambahkan!");
      logActivity({
        action: "Tambah Dokumen",
        description: `Menambahkan dokumen "${data.data.judul_dokumen}"`,
        type: "Dokumen",
      });
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
  const { logActivity } = useAddActivity();

  return useMutation({
    mutationFn: addLog,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["logbook-detail", variables.dokumen_id],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });

      toast.success("Log aktivitas berhasil ditambahkan!");
      logActivity({
        action: "Tambah Log",
        description: `Menambahkan log untuk dokumen ID ${variables.dokumen_id}`,
        type: "Logbook",
      });
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
  const { logActivity } = useAddActivity();

  return useMutation({
    // Sekarang mutationFn menerima objek yang berisi id dan data
    mutationFn: editDokumen,
    onSuccess: (response, variables) => {
      // Invalidate list utama
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });

      // Invalidate detail spesifik dokumen yang baru diedit
      queryClient.invalidateQueries({
        queryKey: ["logbook-detail", variables.id],
      });

      toast.success("Dokumen berhasil diperbarui!");
      logActivity({
        action: "Edit Dokumen",
        description: `Memperbarui dokumen "${response.data.judul_dokumen}"`,
        type: "Dokumen",
      });
    },
    onError: (error: any) => {
      toast.error(
        "Gagal memperbarui dokumen: " +
          (error.response?.data?.message || "Terjadi kesalahan"),
      );
    },
  });
};

export const useEditLog = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();

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
      // 1. Refresh detail dokumen spesifik agar log terbaru muncul
      // 'dokumen_id' dikirim melalui mutate() untuk kebutuhan cache invalidation di frontend
      if (variables.dokumen_id) {
        queryClient.invalidateQueries({
          queryKey: ["logbook-detail", variables.dokumen_id],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["activities"] });

      toast.success("Log aktivitas berhasil diperbarui!");
      logActivity({
        action: "Edit Log",
        description: `Memperbarui log ID ${variables.id}`,
        type: "Logbook",
      });
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
  const { logActivity } = useAddActivity();

  return useMutation({
    // Kita menerima parameter id di sini
    mutationFn: ({
      id,
      judul_dokumen,
    }: {
      id: number;
      judul_dokumen: string;
    }) => deleteDokumen({ id }),
    onSuccess: (_, variables) => {
      // Refresh list agar baris yang dihapus hilang dari tabel
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Dokumen berhasil dihapus!");
      logActivity({
        action: "Hapus Dokumen",
        description: `Menghapus dokumen "${variables.judul_dokumen}" (ID: ${variables.id})`,
        type: "Dokumen",
      });
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
  const { logActivity } = useAddActivity();
  return useMutation({
    mutationFn: (id: number) => deleteLog({ id }),
    onSuccess: (_, variables) => {
      // Sekarang documentId sudah tersedia karena dikirim saat inisialisasi hook
      queryClient.invalidateQueries({
        queryKey: ["logbook-detail", documentId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Log berhasil dihapus!");
      logActivity({
        action: "Hapus Log",
        description: `Menghapus log ID ${variables} pada dokumen ID ${documentId}`,
        type: "Logbook",
      });
    },
  });
};
