import { useMutation } from "@tanstack/react-query";
import { patchData, updateData } from "~/lib/fetch-util";
import type { Profile, ChangePassword } from "types";

// Response type for profile update
interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    nama: string;
    email: string;
    nim_nip: string | null;
    roles: string[];
    created_at: string;
    updated_at: string;
  };
}

// Response type for password change
interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

// Mutation to update user profile
export const useUpdateProfileMutation = () => {
  return useMutation<void, any, Partial<Profile>>({
    mutationFn: (payload) => patchData("/profile/update", payload),
  });
};

//Mutation to change user password
export const useChangePasswordMutation = () => {
  return useMutation<void, any, ChangePassword>({
    mutationFn: (payload) => updateData("/profile/changePassword", payload),
  });
};
