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

function SignIn() {
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
        login(data); // ✅ SEKARANG VALID
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Title (Hidden on mobile, shown as header on mobile) */}
      <div className="lg:hidden bg-white py-8 px-4 text-center border-b">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">SIKMA</h1>
        <p className="text-sm text-gray-600">Sistem Informasi Kerja Sama</p>
      </div>

      {/* Left Section - Desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">SIKMA</h1>
          <p className="text-2xl text-gray-600 leading-relaxed">
            Sistem Informasi
            <br />
            Kerja Sama
          </p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 text-black lg:bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Masukkan username dan password untuk mengakses sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="email@example.com"
                          aria-invalid={!!fieldState.error}
                          className={
                            fieldState.error
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff size={18} className="cursor-pointer" />
                            ) : (
                              <Eye size={18} className="cursor-pointer" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={isPending}
                >
                  {isPending ? "Loading..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SignIn;
