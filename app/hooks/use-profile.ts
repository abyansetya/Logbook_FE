import { useMutation } from "@tanstack/react-query";
import { patchData, updateData } from "~/lib/fetch-util";
import type { Profile, ChangePassword } from "types";
import { toast } from "sonner";

// Response type for profile update
interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    nama: string;
    email: string;
    nim_nip: string | null;
    role: string | null;
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
  return useMutation<ProfileUpdateResponse, any, Partial<Profile>>({
    mutationFn: (payload) => patchData("/profile/update", payload),
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui!");
    },
  });
};

//Mutation to change user password
export const useChangePasswordMutation = () => {
  return useMutation<PasswordChangeResponse, any, ChangePassword>({
    mutationFn: (payload) => updateData("/profile/changePassword", payload),
    onSuccess: () => {
      toast.success("Kata sandi berhasil diubah!");
    },
  });
};
