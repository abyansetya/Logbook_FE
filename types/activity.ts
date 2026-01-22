export interface Activity {
  id: number;
  user_id: number;
  action: string;
  description: string;
  type: string;
  created_at: string;
  user?: ActivityUser;
}

export interface addActivityPayload {
  user_id: number;
  action: string;
  description: string;
  type: string;
}

export interface addActivityResponse {
  success: boolean;
  message: string;
  data: Activity;
}

export interface ActivityUser {
  id: number;
  nama: string;
}

export interface ActivityResponse {
  success: boolean;
  message: string;
  data: Activity[];
}
