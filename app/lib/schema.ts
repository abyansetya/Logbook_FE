import { z } from "zod";

export type SignInFormData = z.infer<typeof signInSchema>;

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
});
