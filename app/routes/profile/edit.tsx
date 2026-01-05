// src/routes/edit.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";

export default function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Profile form state
  const [profileData, setProfileData] = useState({
    nama: user?.nama || "",
    nim_nip: user?.nim_nip || "",
    email: user?.email || "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation state
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {}
  );
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (profileErrors[name]) {
      setProfileErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Password saat ini wajib diisi";
    }

    if (!passwordData.password) {
      newErrors.password = "Password baru wajib diisi";
    } else if (passwordData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (passwordData.password !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateProfile()) {
      setIsUpdatingProfile(true);
      try {
        // TODO: Implement API call to update profile
        console.log("Profile data submitted:", profileData);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Show success message or navigate
        alert("Profil berhasil diperbarui!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Gagal memperbarui profil");
      } finally {
        setIsUpdatingProfile(false);
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validatePassword()) {
      setIsUpdatingPassword(true);
      try {
        // TODO: Implement API call to change password
        console.log("Password data submitted:", {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.password,
        });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Clear password fields after successful update
        setPasswordData({
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });

        alert("Password berhasil diubah!");
      } catch (error) {
        console.error("Error changing password:", error);
        alert("Gagal mengubah password");
      } finally {
        setIsUpdatingPassword(false);
      }
    }
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
        <Card className=" ">
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
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Nama */}
              <div className="space-y-3 group">
                <Label
                  htmlFor="nama"
                  className="text-sm font-semibold flex items-center gap-2 text-black"
                >
                  <User className="h-4 w-4" />
                  Nama Lengkap
                  <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="nama"
                  name="nama"
                  type="text"
                  value={profileData.nama}
                  onChange={handleProfileChange}
                  className={`border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12 ${
                    profileErrors.nama ? "border-red-600" : ""
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                {profileErrors.nama && (
                  <p className="text-sm text-red-600 font-medium">
                    {profileErrors.nama}
                  </p>
                )}
              </div>

              {/* NIM/NIP */}
              <div className="space-y-3 group">
                <Label
                  htmlFor="nim_nip"
                  className="text-sm font-semibold flex items-center gap-2 text-black"
                >
                  <IdCard className="h-4 w-4" />
                  NIM/NIP
                </Label>
                <Input
                  id="nim_nip"
                  name="nim_nip"
                  type="text"
                  value={profileData.nim_nip}
                  onChange={handleProfileChange}
                  className="border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12"
                  placeholder="Masukkan NIM atau NIP"
                />
              </div>

              {/* Email */}
              <div className="space-y-3 group">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold flex items-center gap-2 text-black"
                >
                  <Mail className="h-4 w-4" />
                  Email
                  <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={`border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12 ${
                    profileErrors.email ? "border-red-600" : ""
                  }`}
                  placeholder="nama@example.com"
                />
                {profileErrors.email && (
                  <p className="text-sm text-red-600 font-medium">
                    {profileErrors.email}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isUpdatingProfile
                    ? "Menyimpan..."
                    : "Simpan Perubahan Profil"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card className="">
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
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="bg-gray-50 border-2 border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Catatan:</strong> Pastikan password baru Anda minimal
                  8 karakter dan berbeda dari password lama
                </p>
              </div>

              {/* Current Password */}
              <div className="space-y-3 group">
                <Label
                  htmlFor="currentPassword"
                  className="text-sm font-semibold flex items-center gap-2 text-black"
                >
                  <Lock className="h-4 w-4" />
                  Password Saat Ini
                  <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12 pr-12 ${
                      passwordErrors.currentPassword ? "border-red-600" : ""
                    }`}
                    placeholder="Masukkan password saat ini"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-600 font-medium">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-3 group">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold flex items-center gap-2 text-black"
                >
                  <Lock className="h-4 w-4" />
                  Password Baru
                  <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                    className={`border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12 pr-12 ${
                      passwordErrors.password ? "border-red-600" : ""
                    }`}
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
                {passwordErrors.password && (
                  <p className="text-sm text-red-600 font-medium">
                    {passwordErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-3 group">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold flex items-center gap-2 text-black"
                >
                  <Lock className="h-4 w-4" />
                  Konfirmasi Password Baru
                  <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`border-2 border-black focus:ring-4 focus:ring-gray-200 transition-all text-base h-12 pr-12 ${
                      passwordErrors.confirmPassword ? "border-red-600" : ""
                    }`}
                    placeholder="Ulangi password baru"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-600 font-medium">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  {isUpdatingPassword
                    ? "Mengubah Password..."
                    : "Ubah Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
