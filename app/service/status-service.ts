import { deleteData, fetchData, postData, updateData } from "~/lib/fetch-util";

export interface Status {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
}

export interface StatusesResponse {
  success: boolean;
  message: string;
  data: {
    data: Status[];
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
    };
  };
}

export interface StatusResponse {
  success: boolean;
  message: string;
  data: Status;
}

export interface DeleteStatusResponse {
  success: boolean;
  message: string;
}

export const getStatuses = async (
  page: number = 1,
  search: string = "",
  perPage: number = 10,
): Promise<StatusesResponse> => {
  const query = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  if (search) query.append("q", search);

  return await fetchData<StatusesResponse>(`/status?${query.toString()}`);
};

export const addStatus = async (data: {
  nama: string;
}): Promise<StatusResponse> => {
  return await postData<StatusResponse>("/status", data);
};

export const updateStatus = async ({
  id,
  data,
}: {
  id: number;
  data: { nama: string };
}): Promise<StatusResponse> => {
  return await updateData<StatusResponse>(`/status/${id}`, data);
};

export const deleteStatus = async ({
  id,
}: {
  id: number;
}): Promise<DeleteStatusResponse> => {
  return await deleteData<DeleteStatusResponse>(`/status/${id}`);
};
