import type { DashboardResponse } from "types/dashboard";
import { fetchData } from "~/lib/fetch-util";

export const getDashboardStats = async (
  year?: string | number,
): Promise<DashboardResponse> => {
  const url =
    year && year !== "all" ? `/dashboard?tahun=${year}` : `/dashboard`;
  return await fetchData<DashboardResponse>(url);
};
