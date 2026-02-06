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
  exportLogbook,
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
  tahun: string = "all",
) => {
  return useQuery<LogbooksResponse>({
    queryKey: [
      "logbooks",
      page,
      search,
      perPage,
      status,
      jenisDokumen,
      order,
      tahun,
    ],
    queryFn: () =>
      getLogbooks(page, search, perPage, status, jenisDokumen, order, tahun),
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
    mutationFn: editDokumen,
    onMutate: async (newDoc) => {
      // Menghindari refetch yang sedang berjalan agar tidak menimpa pembaruan optimistik kita
      await queryClient.cancelQueries({ queryKey: ["logbooks"] });
      await queryClient.cancelQueries({
        queryKey: ["logbook-detail", newDoc.id],
      });

      // Ambil snapshot data sebelumnya
      const previousLogbooks = queryClient.getQueriesData({
        queryKey: ["logbooks"],
      });
      const previousDetail = queryClient.getQueryData([
        "logbook-detail",
        newDoc.id,
      ]);

      // Perbarui cache list logbook secara optimistik
      queryClient.setQueriesData({ queryKey: ["logbooks"] }, (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((item: any) =>
              item.id === newDoc.id ? { ...item, ...newDoc.data } : item,
            ),
          },
        };
      });

      // Perbarui cache detail dokumen secara optimistik
      if (previousDetail) {
        queryClient.setQueryData(["logbook-detail", newDoc.id], (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              ...newDoc.data,
            },
          };
        });
      }

      return { previousLogbooks, previousDetail };
    },
    onSuccess: (response) => {
      toast.success("Dokumen berhasil diperbarui!");
      logActivity({
        action: "Edit Dokumen",
        description: `Memperbarui dokumen "${response.data.judul_dokumen}"`,
        type: "Dokumen",
      });
    },
    onError: (error: any, variables, context) => {
      // Rollback data jika terjadi kesalahan
      if (context?.previousLogbooks) {
        context.previousLogbooks.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["logbook-detail", variables.id],
          context.previousDetail,
        );
      }
      toast.error(
        "Gagal memperbarui dokumen: " +
          (error.response?.data?.message || "Terjadi kesalahan"),
      );
    },
    onSettled: (response, error, variables) => {
      // Refresh setelah selesai untuk memastikan data sinkron
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({
        queryKey: ["logbook-detail", variables.id],
      });
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
    mutationFn: ({
      id,
      judul_dokumen,
    }: {
      id: number;
      judul_dokumen: string;
    }) => deleteDokumen({ id }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["logbooks"] });
      const previousLogbooks = queryClient.getQueriesData({
        queryKey: ["logbooks"],
      });

      queryClient.setQueriesData({ queryKey: ["logbooks"] }, (old: any) => {
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

      return { previousLogbooks };
    },
    onSuccess: (_, variables) => {
      toast.success("Dokumen berhasil dihapus!");
      logActivity({
        action: "Hapus Dokumen",
        description: `Menghapus dokumen "${variables.judul_dokumen}" (ID: ${variables.id})`,
        type: "Dokumen",
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousLogbooks) {
        context.previousLogbooks.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      toast.error(
        "Gagal menghapus dokumen: " + (error.message || "Terjadi kesalahan"),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};

export const useDeleteLog = (documentId: number) => {
  const queryClient = useQueryClient();
  const { logActivity } = useAddActivity();
  return useMutation({
    mutationFn: (id: number) => deleteLog({ id }),
    onMutate: async (logId) => {
      await queryClient.cancelQueries({
        queryKey: ["logbook-detail", documentId],
      });
      const previousDetail = queryClient.getQueryData([
        "logbook-detail",
        documentId,
      ]);

      queryClient.setQueryData(["logbook-detail", documentId], (old: any) => {
        if (!old?.data?.logs) return old;
        return {
          ...old,
          data: {
            ...old.data,
            logs: old.data.logs.filter((log: any) => log.id !== logId),
          },
        };
      });

      return { previousDetail };
    },
    onSuccess: (_, variables) => {
      toast.success("Log berhasil dihapus!");
      logActivity({
        action: "Hapus Log",
        description: `Menghapus log ID ${variables} pada dokumen ID ${documentId}`,
        type: "Logbook",
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["logbook-detail", documentId],
          context.previousDetail,
        );
      }
      toast.error(
        "Gagal menghapus log: " + (error.message || "Terjadi kesalahan"),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["logbook-detail", documentId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};

export const useExportLogbook = () => {
  return useMutation({
    mutationFn: ({
      search,
      status,
      jenisDokumen,
      order,
      tahun,
    }: {
      search: string;
      status: string;
      jenisDokumen: string;
      order: "asc" | "desc";
      tahun: string;
    }) => exportLogbook(search, status, jenisDokumen, order, tahun),
    onSuccess: (blob) => {
      // Buat link download virtual
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Logbook_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Logbook berhasil diunduh");
    },
    onError: (error: any) => {
      toast.error(
        "Gagal mengunduh logbook: " + (error.message || "Terjadi kesalahan"),
      );
    },
  });
};
