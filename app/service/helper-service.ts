import type { statusResponse } from "types/status";
import { fetchData } from "~/lib/fetch-util";

export const getStatus = async (): Promise<statusResponse> => {
  return await fetchData<statusResponse>("/helper/getStatus");
};
