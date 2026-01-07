import { z } from "zod";

export type SignInFormData = z.infer<typeof signInSchema>;

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(255, "Nama maksimal 255 karakter"),

  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),

  nim_nip: z.string().max(50, "NIM/NIP maksimal 50 karakter").optional(),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Password saat ini wajib diisi"),

    new_password: z.string().min(8, "Password baru minimal 8 karakter"),

    new_password_confirmation: z
      .string()
      .min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Konfirmasi password tidak sama",
    path: ["new_password_confirmation"],
  });
