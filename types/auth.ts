import type { User } from "./index";

export interface LoginResponse {
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
    expires_in: number;
  };
}
