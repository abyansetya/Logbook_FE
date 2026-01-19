import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { signUpSchema, type SignUpFormData } from "~/lib/schema";
import { useRegisterMutation } from "~/hooks/use-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import Undip from "../../assets/undip.png";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nama: "",
      email: "",
      password: "",
      password_confirmation: "",
      nim_nip: "",
    },
  });

  const { mutate, isPending } = useRegisterMutation();

  const handleSubmit = (values: SignUpFormData) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Registrasi berhasil, silakan login");
        navigate("/sign-in");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Registrasi gagal");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-white relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,var(--tw-primary)_0%,transparent_40%),radial-gradient(circle_at_bottom_left,var(--tw-primary)_0%,transparent_40%)]"
        style={{ backgroundColor: "#ffffff" }}
      ></div>
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[grid-slate-100] mask-[linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>

      <div className="w-full max-w-[500px] relative z-10 px-6 py-12">
        <Card className="border-none bg-white/80 backdrop-blur-md rounded-2xl">
          <CardContent className="pt-8 px-8 pb-10">
            {/* Header / Logo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 mb-4 ">
                <img
                  src={Undip}
                  alt="UNDIP Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center space-y-1">
                <h1 className="text-3xl font-extrabold text-[#1a202c]">
                  Register
                </h1>
                <div className="space-y-0.5">
                  <p className="text-[#4a5568] font-bold text-sm tracking-tight">
                    Logbook Kerja Sama
                  </p>
                  <p className="text-[#718096] text-xs font-medium uppercase tracking-widest">
                    Universitas Diponegoro
                  </p>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        Nama Lengkap
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan nama lengkap"
                          className="h-10 border-slate-200 focus-visible:ring-primary rounded-xl bg-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="name@example.com"
                          className="h-10 border-slate-200 focus-visible:ring-primary rounded-xl bg-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nim_nip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        NIM / NIP (Opsional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan NIM atau NIP"
                          className="h-10 border-slate-200 focus-visible:ring-primary rounded-xl bg-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-10 border-slate-200 focus-visible:ring-primary rounded-xl bg-white/50 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">
                          Konfirmasi Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-10 border-slate-200 focus-visible:ring-primary rounded-xl bg-white/50 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 font-bold rounded-xl text-base transition-all shadow-md active:scale-[0.98] mt-2"
                  disabled={isPending}
                >
                  {isPending ? "Registering..." : "Sign Up"}
                </Button>

                <p className="text-center text-slate-500 text-sm mt-4">
                  Sudah punya akun?{" "}
                  <Link
                    to="/sign-in"
                    className="text-primary font-bold hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
          <span>© 2025 Universitas Diponegoro • All Rights Reserved</span>
        </div>
      </div>
    </div>
  );
}
