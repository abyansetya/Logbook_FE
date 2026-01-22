import type {
  ActivityResponse,
  addActivityPayload,
  addActivityResponse,
} from "types/activity";
import { fetchData, postData } from "~/lib/fetch-util";

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

export interface KlasifikasiMitra {
  id: number;
  nama: string;
}

export interface KlasifikasiResponse {
  success: boolean;
  message: string;
  data: KlasifikasiMitra[];
}

export const getKlasifikasis = async (): Promise<KlasifikasiResponse> => {
  return await fetchData<KlasifikasiResponse>("/helper/getKlasifikasi");
};

export const addActivity = async (
  payload: addActivityPayload,
): Promise<addActivityResponse> => {
  return await postData<addActivityResponse>(
    "/helper/save-activities",
    payload,
  );
};

export const getRecentActivities = async (): Promise<ActivityResponse> => {
  return await fetchData<ActivityResponse>("/helper/activities");
};
