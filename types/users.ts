export interface User {
  id: number;
  nama: string;
  email: string;
  nim_nip: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  success: boolean;
  data: User[];
}

export interface roleResponse {
  id: number;
  roles: string[];
}

export interface updateRoleResponse {
  success: boolean;
  message: string;
  data: roleResponse;
}
