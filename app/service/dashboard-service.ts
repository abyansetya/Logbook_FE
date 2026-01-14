import type { DashboardResponse } from "types/dashboard";
import { fetchData } from "~/lib/fetch-util";

export const getDashboardStats = async (): Promise<DashboardResponse> => {
  return await fetchData<DashboardResponse>(`/dashboard`);
};
