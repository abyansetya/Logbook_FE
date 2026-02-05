import { deleteData, fetchData, postData, updateData } from "~/lib/fetch-util";

export interface Unit {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
}

export interface UnitsResponse {
  success: boolean;
  message: string;
  data: {
    data: Unit[];
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

export interface UnitResponse {
  success: boolean;
  message: string;
  data: Unit;
}

export interface DeleteUnitResponse {
  success: boolean;
  message: string;
}

export const getUnits = async (
  page: number = 1,
  search: string = "",
  perPage: number = 10,
): Promise<UnitsResponse> => {
  const query = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  if (search) query.append("q", search);

  return await fetchData<UnitsResponse>(`/unit?${query.toString()}`);
};

export const addUnit = async (data: {
  nama: string;
}): Promise<UnitResponse> => {
  return await postData<UnitResponse>("/unit", data);
};

export const updateUnit = async ({
  id,
  data,
}: {
  id: number;
  data: { nama: string };
}): Promise<UnitResponse> => {
  return await updateData<UnitResponse>(`/unit/${id}`, data);
};

export const deleteUnit = async ({
  id,
}: {
  id: number;
}): Promise<DeleteUnitResponse> => {
  return await deleteData<DeleteUnitResponse>(`/unit/${id}`);
};
