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
import { data, useNavigate } from "react-router";
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
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-white">
      {/* LEFT SECTION - LOGIN FORM */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 lg:px-20 relative">
        {/* Logo Sellora (Atas Kiri) */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          {/* Mengubah bg-blue-600 menjadi bg-primary */}
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">S</span>
          </div>
          <span className="text-2xl font-bold text-[#1e293b]">Sellora</span>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#1e293b] mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Enter your email and password to access your account.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="sellostore@company.com"
                        /* Mengubah focus:ring-blue-500 menjadi focus:ring-primary */
                        className="h-12 border-gray-200 focus-visible:ring-primary rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-gray-700 font-semibold">
                        Password
                      </FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="5ellostore."
                          /* Mengubah focus:ring-blue-500 menjadi focus:ring-primary */
                          className="h-12 border-gray-200 focus-visible:ring-primary rounded-lg pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="remember"
                          /* Mengubah text-blue-600 dan focus:ring-blue-500 menjadi primary */
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm text-gray-600"
                        >
                          Remember Me
                        </label>
                      </div>
                      <button
                        type="button"
                        /* Mengubah text-blue-600 menjadi text-primary */
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Forgot Your Password?
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                /* Mengubah bg-blue-600 hover:bg-blue-700 menjadi bg-primary */
                className="w-full h-12 bg-primary text-primary-foreground hover:opacity-90 font-bold rounded-lg text-lg transition-colors"
                disabled={isPending}
              >
                {isPending ? "Loading..." : "Log In"}
              </Button>

              <p className="text-center text-gray-500 text-sm mt-6">
                Don't Have An Account?{" "}
                <button
                  /* Mengubah text-blue-600 menjadi text-primary */
                  className="text-primary font-bold hover:underline"
                >
                  Register Now.
                </button>
              </p>
            </form>
          </Form>
        </div>

        {/* Footer (Bottom) */}
        <div className="absolute bottom-6 w-full flex justify-between px-8 text-xs text-gray-400 font-medium">
          <span>Copyright © 2025 Sellora Enterprises LTD.</span>
          <span className="cursor-pointer hover:underline">Privacy Policy</span>
        </div>
      </div>

      {/* RIGHT SECTION - HERO/PREVIEW */}
      {/* Mengubah bg-[#3b52f6] menjadi bg-primary */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

        <div className="relative z-10 w-full max-w-lg text-primary-foreground">
          <h2 className="text-5xl font-bold leading-tight mb-4 text-white">
            Effortlessly manage your team and operations.
          </h2>
          <p className="text-white/80 text-xl mb-12">
            Log in to access your CRM dashboard and manage your team.
          </p>

          <div className="rounded-2xl shadow-2xl overflow-hidden border-8 border-white/10">
            <img
              src="https://framerusercontent.com/images/k2C8uYh8oY7hR8s7Gz8z8z8z8.png"
              alt="Dashboard Preview"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
