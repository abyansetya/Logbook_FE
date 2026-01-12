import { fetchData } from "~/lib/fetch-util";

export const getLogbooks = async (page: number = 1) => {
  return await fetchData(`/api/v1/logbook?page=${page}`);
};

export const getLogbookDetail = async (id: number) => {
  return await fetchData(`/api/v1/logbook/dokumen/${id}`);
};
