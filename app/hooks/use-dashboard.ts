import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "~/service/dashboard-service";
import type { DashboardResponse } from "../../types/dashboard";

export const useDashboardStats = (year?: string | number) => {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard-stats", year],
    queryFn: () => getDashboardStats(year),
    // Opsional: Refresh data setiap 5 menit agar angka tetap update
    staleTime: 5 * 60 * 1000,
    // Opsional: Tampilkan data lama saat melakukan fetch ulang
    placeholderData: (previousData) => previousData,
  });
};
