import { fetchData, updateData, deleteData } from "../lib/fetch-util";
import type { updateRoleResponse, UserResponse } from "../../types/users";

export const searchUser = async (query: string): Promise<UserResponse> => {
  return await fetchData<UserResponse>(`/users/search?q=${query}`);
};

export const getUsers = async (): Promise<UserResponse> => {
  return await fetchData<UserResponse>(`/users`);
};

export const updateUserRole = async (
  userId: number,
  newRole: string,
): Promise<updateRoleResponse> => {
  return await updateData<updateRoleResponse>(`/users/${userId}/role`, {
    role: newRole,
  });
};

export const deleteUser = async (userId: number): Promise<any> => {
  return await deleteData(`/users/${userId}`);
};
