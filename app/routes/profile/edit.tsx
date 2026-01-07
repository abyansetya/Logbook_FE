// src/routes/edit.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  IdCard,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "~/provider/auth-context";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "~/hooks/use-profile";
import { toast } from "sonner";
import { updateProfileSchema, changePasswordSchema } from "~/lib/schema";
import type { z } from "zod";

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function EditProfilePage() {
  const { user, login, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Mutations
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form
  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      nama: user?.nama || "",
      nim_nip: user?.nim_nip || "",
      email: user?.email || "",
    },
  });

  // Password form
  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const handleProfileSubmit = (values: UpdateProfileFormData) => {
    updateProfileMutation.mutate(values, {
      onSuccess: (response: any) => {
        updateUser(response.data); // 🔥 SELESAI

        toast.success("Profil berhasil diperbarui");
        navigate("/profile");

        // Navigate back to profile after a short delay
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      },
      onError: (error: any) => {
        console.error("Error updating profile:", error);

        const errorMessage =
          error?.response?.data?.message || "Gagal memperbarui profil";
        toast.error(errorMessage);
      },
    });
  };

  const handlePasswordSubmit = (values: ChangePasswordFormData) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        // Clear password fields after successful update
        passwordForm.reset();

        toast.success("Password berhasil diubah");
        logout();
      },
      onError: (error: any) => {
        console.error("Error changing password:", error);

        const errorMessage =
          error?.response?.data?.message || "Gagal mengubah password";

        toast.error(errorMessage);

        // If current password is wrong, set error
        if (error?.response?.data?.errors?.current_password) {
          passwordForm.setError("current_password", {
            type: "manual",
            message: error.response.data.errors.current_password[0],
          });
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="group hover:bg-black hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Profil
          </Button>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-black">
              Edit Profil
            </h1>
            <p className="text-lg text-gray-600">
              Perbarui informasi akun Anda dengan aman
            </p>
          </div>
        </div>

        {/* Profile Information Card */}
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl font-bold">
              Informasi Profil
            </CardTitle>
            <CardDescription className="text-base">
              Update nama, NIM/NIP, dan email Anda
            </CardDescription>
          </CardHeader>

          <Separator className="bg-black" />

          <CardContent className="pt-8">
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                className="space-y-6"
              >
                {/* Nama */}
                <FormField
                  control={profileForm.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-semibold flex items-center gap-2 text-black">
                        <User className="h-4 w-4" />
                        Nama Lengkap
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12"
                          placeholder="Masukkan nama lengkap"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 font-medium" />
                    </FormItem>
                  )}
                />

                {/* NIM/NIP */}
                <FormField
                  control={profileForm.control}
                  name="nim_nip"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-semibold flex items-center gap-2 text-black">
                        <IdCard className="h-4 w-4" />
                        NIM/NIP
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          type="text"
                          className="border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12"
                          placeholder="Masukkan NIM atau NIP"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 font-medium" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-semibold flex items-center gap-2 text-black">
                        <Mail className="h-4 w-4" />
                        Email
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12"
                          placeholder="nama@example.com"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 font-medium" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {updateProfileMutation.isPending
                      ? "Menyimpan..."
                      : "Simpan Perubahan Profil"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Ubah Password
                </CardTitle>
                <CardDescription className="text-base">
                  Ganti password Anda untuk keamanan akun
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <Separator className="bg-black" />

          <CardContent className="pt-8">
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-6"
              >
                <div className="bg-gray-50 border-2 border-gray-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Catatan:</strong> Pastikan password baru Anda
                    minimal 8 karakter dan berbeda dari password lama
                  </p>
                </div>

                {/* Current Password */}
                <FormField
                  control={passwordForm.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-semibold flex items-center gap-2 text-black">
                        <Lock className="h-4 w-4" />
                        Password Saat Ini
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showCurrentPassword ? "text" : "password"}
                            className="border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12 pr-12"
                            placeholder="Masukkan password saat ini"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 font-medium" />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={passwordForm.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-semibold flex items-center gap-2 text-black">
                        <Lock className="h-4 w-4" />
                        Password Baru
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12 pr-12"
                            placeholder="Minimal 8 karakter"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 font-medium" />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={passwordForm.control}
                  name="new_password_confirmation"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-semibold flex items-center gap-2 text-black">
                        <Lock className="h-4 w-4" />
                        Konfirmasi Password Baru
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            className="border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12 pr-12"
                            placeholder="Ulangi password baru"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm text-red-600 font-medium" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    {changePasswordMutation.isPending
                      ? "Mengubah Password..."
                      : "Ubah Password"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
