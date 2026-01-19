import { fetchData } from "~/lib/fetch-util";

export interface Status {
  id: number;
  nama: string;
}

export interface StatusesResponse {
  success: boolean;
  message: string;
  data: Status[];
}

export const getStatuses = async (): Promise<StatusesResponse> => {
  return await fetchData<StatusesResponse>("/helper/getStatus");
};
