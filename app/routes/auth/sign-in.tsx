import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { signInSchema } from "~/lib/schema";
import type z from "zod";
import { data, useNavigate, Link } from "react-router";
import { useAuth } from "~/provider/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "~/hooks/use-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import type { SignInFormData } from "~/lib/schema";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Undip from "../../assets/undip.png";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutation();
  const handleSubmit = (values: SignInFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        login(data);
        toast.success("Login berhasil");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Login gagal");
      },
    });
  };
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-white relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,var(--tw-primary)_0%,transparent_40%),radial-gradient(circle_at_bottom_left,var(--tw-primary)_0%,transparent_40%)]"
        style={{ backgroundColor: "#ffffff" }}
      ></div>
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[grid-slate-100] mask-[linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>

      <div className="w-full max-w-[500px] relative z-10 ">
        <Card className="border-none  bg-white/80 backdrop-blur-md rounded-2xl">
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
                  Login
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
                className="space-y-5"
              >
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
                          className="h-11 border-slate-200 focus-visible:ring-primary rounded-xl bg-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-sm font-semibold text-slate-700">
                          Password
                        </FormLabel>
                        <button
                          type="button"
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-11 border-slate-200 focus-visible:ring-primary rounded-xl bg-white/50 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 font-bold rounded-xl text-base transition-all shadow-md active:scale-[0.98]"
                  disabled={isPending}
                >
                  {isPending ? "Signing in..." : "Sign In"}
                </Button>

                <p className="text-center text-slate-500 text-sm mt-4">
                  Don't have an account?{" "}
                  <Link
                    to="/sign-up"
                    className="text-primary font-bold hover:underline"
                  >
                    Register
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
