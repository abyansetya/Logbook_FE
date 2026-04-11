import { useMutation } from "@tanstack/react-query";
import { postData } from "~/lib/fetch-util";
import type { RegisterResponse } from "types/auth";
import type { SignUpFormData } from "~/lib/schema";

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, any, SignUpFormData>({
    mutationFn: (payload) => postData("/auth/register", payload),
  });
};
