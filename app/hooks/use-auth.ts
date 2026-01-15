import { useMutation } from "@tanstack/react-query";
import { Type } from "lucide-react";
import { postData } from "~/lib/fetch-util";
import type { LoginResponse } from "types/auth";
import type { SignInFormData } from "~/lib/schema";

export const useLoginMutation = () => {
  return useMutation<LoginResponse, any, SignInFormData>({
    mutationFn: (payload) => postData("/auth/login", payload),
  });
};
