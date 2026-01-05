export interface User {
  id: number;
  nama: string;
  email: string;
  nim_nip: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface Profile {
  nama: string;
  email: string;
  nim_nip: string;
}

export interface ChangePassword {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}
