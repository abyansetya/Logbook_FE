import { api, deleteData, fetchData, postData, updateData } from "~/lib/fetch-util";
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
  tahun: string = "all",
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
  if (tahun && tahun !== "all") query.append("tahun", tahun);

  return await fetchData<LogbooksResponse>(`/logbook?${query.toString()}`);
};

export const exportLogbook = async (
  search: string = "",
  status: string = "all",
  jenisDokumen: string = "all",
  order: "asc" | "desc" = "desc",
  tahun: string = "all",
): Promise<Blob> => {
  const query = new URLSearchParams();
  if (search) query.append("q", search);
  if (status && status !== "all") query.append("status", status);
  if (jenisDokumen && jenisDokumen !== "all")
    query.append("jenis_dokumen", jenisDokumen);
  if (tahun && tahun !== "all") query.append("tahun", tahun);
  query.append("order", order);

  const response = await api.get("/logbook/export", {
    params: query,
    responseType: "blob",
  });

  return response.data;
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
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(
        key,
        value instanceof Date ? value.toISOString().split("T")[0] : value,
      );
    }
  });

  const response = await api.post("/logbook/dokumen", formData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const searchMitra = async (
  query: string,
): Promise<MitraSearchResponse> => {
  const params = new URLSearchParams({ q: query });

  return await fetchData<MitraSearchResponse>(`/mitra/search?${params}`);
};

export const searchDocument = async (
  query: string,
): Promise<DocumentSearchResponse> => {
  const params = new URLSearchParams({ q: query });

  return await fetchData<DocumentSearchResponse>(
    `/logbook/search-dokumen?${params}`,
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
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    // Selalu masukkan nilai jika itu draft_dokumen atau final_dokumen (bisa berupa "" untuk hapus)
    const isFileField = key === "draft_dokumen" || key === "final_dokumen";

    if (
      isFileField ||
      (value !== undefined && value !== null && value !== "")
    ) {
      formData.append(
        key,
        value instanceof Date ? value.toISOString().split("T")[0] : value,
      );
    }
  });

  // Method spoofing for Laravel PUT requests with files
  formData.append("_method", "PUT");

  const response = await api.post(`/logbook/edit-dokumen/${id}`, formData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
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
