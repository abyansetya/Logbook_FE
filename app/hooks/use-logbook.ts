import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getLogbooks, getLogbookDetail } from "~/service/logbook-service";
import type {
  LogbooksResponse,
  LogbookDetailResponse,
} from "../../types/logbook";

// Hook untuk list logbook
export const useLogbooks = (page: number) => {
  return useQuery<LogbooksResponse>({
    queryKey: ["logbooks", page],
    queryFn: () => getLogbooks(page),
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
