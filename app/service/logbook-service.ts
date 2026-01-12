import { fetchData } from "~/lib/fetch-util";
import type {
  LogbooksResponse,
  LogbookDetailResponse,
} from "../../types/logbook";

export const getLogbooks = async (
  page: number = 1
): Promise<LogbooksResponse> => {
  // Masukkan interface ke dalam < > agar fetchData mengembalikan tipe yang benar
  return await fetchData<LogbooksResponse>(`/logbook?page=${page}`);
};

export const getLogbookDetail = async (
  id: number
): Promise<LogbookDetailResponse> => {
  // Gunakan interface detail untuk endpoint detail
  return await fetchData<LogbookDetailResponse>(`/logbook/dokumen/${id}`);
};
