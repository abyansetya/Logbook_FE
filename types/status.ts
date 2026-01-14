export interface status {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
}

export interface statusResponse {
  success: boolean;
  message: string;
  data: status[];
}
