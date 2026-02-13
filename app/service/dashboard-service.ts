import type { DashboardResponse } from "types/dashboard";
import { fetchData } from "~/lib/fetch-util";

export const getDashboardStats = async (
  year?: string | number,
  status?: string | number,
): Promise<DashboardResponse> => {
  const params = new URLSearchParams();
  if (year && year !== "all") params.append("tahun", year.toString());
  if (status && status !== "all") params.append("status", status.toString());

  const url = `/dashboard?${params.toString()}`;
  return await fetchData<DashboardResponse>(url);
};
