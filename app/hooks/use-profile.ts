import { useMutation } from "@tanstack/react-query";
import { patchData, updateData } from "~/lib/fetch-util";
import type { Profile, ChangePassword } from "types";

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
