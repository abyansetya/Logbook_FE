import { describe, it, expect } from "vitest";
import { signInSchema, signUpSchema, tambahLogSchema } from "../schema";

describe("signInSchema", () => {
  it("menerima email dan password yang valid", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("menolak email yang tidak valid", () => {
    const result = signInSchema.safeParse({
      email: "bukan-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("menolak password kosong", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("signUpSchema", () => {
  it("menolak password tanpa huruf besar", () => {
    const result = signUpSchema.safeParse({
      nama: "Budi",
      email: "budi@example.com",
      nim_nip: "24060123120001",
      password: "password123!",
      password_confirmation: "password123!",
    });
    expect(result.success).toBe(false);
  });

  it("menolak konfirmasi password yang tidak sama", () => {
    const result = signUpSchema.safeParse({
      nama: "Budi",
      email: "budi@example.com",
      nim_nip: "24060123120001",
      password: "Password123!",
      password_confirmation: "Password456!",
    });
    expect(result.success).toBe(false);
  });
});

describe("tambahLogSchema", () => {
  it("menolak tanggal dengan format salah", () => {
    const result = tambahLogSchema.safeParse({
      user_id: 1,
      mitra_id: 1,
      dokumen_id: 1,
      unit_id: 1,
      keterangan: "Ini keterangan yang valid",
      tanggal_log: "10-05-2026",
    });
    expect(result.success).toBe(false);
  });
});
