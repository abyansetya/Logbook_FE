import { deleteData, fetchData, postData, updateData } from "~/lib/fetch-util";
import {
  type LogbooksResponse,
  type LogbookDetailResponse,
  type AddDokumenResponse,
  type DocumentSearchResponse,
  type DeleteDokumenResponse,
} from "../../types/logbook";
import type { TambahDokumenData } from "~/lib/schema";
import type { MitraCreateResponse, MitraSearchResponse } from "types/mitra";

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

export const addDokumen = async (
  data: TambahDokumenData
): Promise<AddDokumenResponse> => {
  return await postData<AddDokumenResponse>("/logbook/dokumen", data);
};

export const searchMitra = async (
  query: string
): Promise<MitraSearchResponse> => {
  return await fetchData<MitraSearchResponse>(`/mitra/search?q=${query}`);
};

export const searchDocument = async (
  query: string
): Promise<DocumentSearchResponse> => {
  return await fetchData<DocumentSearchResponse>(
    `/logbook/search-dokumen?q=${query}`
  );
};

export const addMitraQuick = async (data: {
  nama: string;
  klasifikasi_mitra_id: number;
}): Promise<MitraCreateResponse> => {
  return await postData<MitraCreateResponse>(
    "/mitra/addMitraWithoutClass",
    data
  );
};

export const editDokumen = async ({
  id,
  data,
}: {
  id: number;
  data: TambahDokumenData;
}): Promise<AddDokumenResponse> => {
  // Mengarahkan ke endpoint /logbook/{id} sesuai route Laravel yang kita bahas
  return await updateData<AddDokumenResponse>(
    `/logbook/edit-dokumen/${id}`,
    data
  );
};

export const deleteDokumen = async ({
  id,
}: {
  id: number;
}): Promise<DeleteDokumenResponse> => {
  return await deleteData<DeleteDokumenResponse>(
    `/logbook/delete-dokumen/${id}`
  );
};
