import { useQuery } from "@tanstack/react-query";
import { getLogbooks, getLogbookDetail } from "~/service/logbook-service";

//hook to fetch logbooks with pagination
export const useLogbooks = (page: number) => {
  return useQuery({
    queryKey: ["logbooks", page],
    queryFn: () => getLogbooks(page),
    placeholderData: (previousData) => previousData, // Menjaga UI tetap stabil saat loading page baru
  });
};

//hook to fetch logbook detail by dokumen id
export const useLogbookDetail = (id: number) => {
  return useQuery({
    queryKey: ["logbook-detail", id],
    queryFn: () => getLogbookDetail(id),
    enabled: !!id, // Hanya jalankan query jika id tersedia
    staleTime: 5 * 60 * 1000, // Data dianggap segar selama 5 menit
  });
};
