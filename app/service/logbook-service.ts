import { deleteData, fetchData, postData, updateData } from "~/lib/fetch-util";
import {
  type LogbooksResponse,
  type LogbookDetailResponse,
  type AddDokumenResponse,
  type DocumentSearchResponse,
  type DeleteDokumenResponse,
  type addLogResponse,
  type updateLogData,
  type updateLogResponse,
} from "../../types/logbook";
import type { TambahDokumenData, TambahLogData } from "~/lib/schema";
import type {
  MitraCreateResponse,
  MitraSearchResponse,
} from "../../types/mitra";

export const getLogbooks = async (
  page: number = 1,
  search: string = "",
  perPage: number = 10,
  status: string = "all",
  jenisDokumen: string = "all",
  order: "asc" | "desc" = "desc",
): Promise<LogbooksResponse> => {
  const query = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    order: order,
  });
  if (search) query.append("q", search);
  if (status && status !== "all") query.append("status", status);
  if (jenisDokumen && jenisDokumen !== "all")
    query.append("jenis_dokumen", jenisDokumen);

  return await fetchData<LogbooksResponse>(`/logbook?${query.toString()}`);
};

export const exportLogbook = async (
  search: string = "",
  status: string = "all",
  jenisDokumen: string = "all",
): Promise<Blob> => {
  const query = new URLSearchParams();
  if (search) query.append("q", search);
  if (status && status !== "all") query.append("status", status);
  if (jenisDokumen && jenisDokumen !== "all")
    query.append("jenis_dokumen", jenisDokumen);

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/logbook/export?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is here, or handle via axios/fetch-util if it supports blob
      },
    },
  );

  if (!response.ok) {
    throw new Error("Gagal mengunduh file");
  }

  return await response.blob();
};

export const getLogbookDetail = async (
  id: number,
): Promise<LogbookDetailResponse> => {
  // Gunakan interface detail untuk endpoint detail
  return await fetchData<LogbookDetailResponse>(`/logbook/dokumen/${id}`);
};

export const addDokumen = async (
  data: TambahDokumenData,
): Promise<AddDokumenResponse> => {
  return await postData<AddDokumenResponse>("/logbook/dokumen", data);
};

export const searchMitra = async (
  query: string,
): Promise<MitraSearchResponse> => {
  return await fetchData<MitraSearchResponse>(`/mitra/search?q=${query}`);
};

export const searchDocument = async (
  query: string,
): Promise<DocumentSearchResponse> => {
  return await fetchData<DocumentSearchResponse>(
    `/logbook/search-dokumen?q=${query}`,
  );
};

export const addMitraQuick = async (data: {
  nama: string;
  klasifikasi_mitra_id: number;
}): Promise<MitraCreateResponse> => {
  return await postData<MitraCreateResponse>(
    "/mitra/addMitraWithoutClass",
    data,
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
    data,
  );
};

export const deleteDokumen = async ({
  id,
}: {
  id: number;
}): Promise<DeleteDokumenResponse> => {
  return await deleteData<DeleteDokumenResponse>(
    `/logbook/delete-dokumen/${id}`,
  );
};

export const addLog = async (data: TambahLogData): Promise<addLogResponse> => {
  return await postData<addLogResponse>(`/logbook/add-log`, data);
};

export const editLog = async ({
  id,
  data,
}: {
  id: number;
  data: updateLogData;
}): Promise<updateLogResponse> => {
  return await updateData<updateLogResponse>(`/logbook/edit-log/${id}`, data);
};

export const deleteLog = async ({
  id,
}: {
  id: number;
}): Promise<DeleteDokumenResponse> => {
  return await deleteData<DeleteDokumenResponse>(`/logbook/delete-log/${id}`);
};
