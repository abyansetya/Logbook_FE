import { useMutation } from "@tanstack/react-query";
import { Type } from "lucide-react";
import { postData } from "~/lib/fetch-util";
import type { LoginResponse, RegisterResponse } from "types/auth";
import type { SignInFormData, SignUpFormData } from "~/lib/schema";

export const useLoginMutation = () => {
  return useMutation<LoginResponse, any, SignInFormData>({
    mutationFn: (payload) => postData("/auth/login", payload),
  });
};

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, any, SignUpFormData>({
    mutationFn: (payload) => postData("/auth/register", payload),
  });
};
