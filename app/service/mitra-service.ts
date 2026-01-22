import { fetchData, postData, updateData, deleteData } from "../lib/fetch-util";
import type { Mitra, MitraResponse, MitraPayload } from "../../types/mitra";

export const getMitra = async (
  page = 1,
  search = "",
  perPage = 10,
  klasifikasi = "all",
): Promise<MitraResponse> => {
  const query = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  if (search) query.append("q", search);
  if (klasifikasi && klasifikasi !== "all")
    query.append("klasifikasi", klasifikasi);
  return await fetchData<MitraResponse>(`/mitra?${query.toString()}`);
};

export const createMitra = async (payload: MitraPayload): Promise<any> => {
  return await postData("/mitra", payload);
};

export const updateMitra = async (
  id: number,
  payload: Partial<MitraPayload>,
): Promise<any> => {
  return await updateData(`/mitra/${id}`, payload);
};

export const deleteMitra = async (id: number): Promise<any> => {
  return await deleteData(`/mitra/${id}`);
};
