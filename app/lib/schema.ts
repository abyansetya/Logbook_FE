import { z } from "zod";

export type SignInFormData = z.infer<typeof signInSchema>;
export type TambahDokumenData = z.infer<typeof tambahDokumenSchema>;
export type TambahLogData = z.infer<typeof tambahLogSchema>;
export type updateLogData = z.infer<typeof updateLogSchema>;

export const updateLogSchema = z.object({
  user_id: z.number({ message: "User ID Wajib diisi" }),
  keterangan: z
    .string()
    .min(5, "Keterangan minimal berisi 5 karakter")
    .max(500, "Keterangan terlalu panjang"),
  contact_person: z
    .string()
    .min(1, "Contact person wajib diisi")
    .max(255, "Contact person maksimal 255 karakter"),
  tanggal_log: z
    .string()
    .min(1, "Tanggal log wajib diisi")
    // Pastikan format string tanggal valid (YYYY-MM-DD)
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid"),
});

export const tambahLogSchema = z.object({
  user_id: z.number({ message: "User ID wajib diisi" }),
  mitra_id: z.number({ message: "Mitra ID wajib diisi" }),
  dokumen_id: z.number({ message: "Dokumen ID wajib diisi" }),
  keterangan: z
    .string()
    .min(5, "Keterangan minimal berisi 5 karakter")
    .max(500, "Keterangan terlalu panjang"),
  contact_person: z
    .string()
    .min(1, "Contact person wajib diisi")
    .max(255, "Contact person maksimal 255 karakter"),
  tanggal_log: z
    .string()
    .min(1, "Tanggal log wajib diisi")
    // Pastikan format string tanggal valid (YYYY-MM-DD)
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid"),
});

export const tambahDokumenSchema = z.object({
  mitra_id: z.number({ message: "Mitra wajib diisi" }),
  jenis_dokumen_id: z.number({ message: "Jenis dokumen wajib diisi" }),
  nomor_dokumen_mitra: z
    .string()
    .max(100, "Nomor dokumen mitra maksimal 100 karakter")
    .optional(),
  nomor_dokumen_undip: z
    .string()
    .max(100, "Nomor dokumen undip maksimal 100 karakter")
    .optional(),
  judul_dokumen: z
    .string()
    .min(1, "Judul dokumen wajib diisi")
    .max(255, "Judul dokumen maksimal 255 karakter"),
  status_id: z.number({ message: "Status dokumen wajib diisi" }),
  tanggal_masuk: z
    .string()
    .min(1, "Tanggal masuk wajib diisi")
    .optional()
    .or(z.literal("")),
  tanggal_terbit: z.string().optional().or(z.literal("")),
});

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
