export interface User {
  id: number;
  nama: string;
  email: string;
  nim_nip: string;
  role: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  success: boolean;
  data: User[];
}

export interface roleResponse {
  id: number;
  role: string | null;
}

export interface updateRoleResponse {
  success: boolean;
  message: string;
  data: roleResponse;
}
