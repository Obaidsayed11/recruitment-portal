"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import { RxEyeClosed } from "react-icons/rx";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/axiosInterceptor";
import Button from "../Others/Button";

interface LoginData {
  password: string;
  cPassword: string;
}

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const otp = searchParams?.get("otp") || "";
  const [viewPassword, setViewPassword] = useState(false);

  const form = useForm<LoginData>({
    defaultValues: {
      password: "",
      cPassword: "",
    },
  });

  const { handleSubmit, reset, control } = form;

  const onSubmit = async (data: LoginData) => {
    try {
      const response = await apiClient.put("/auth/reset-password", {
        email,
        otp,
        password: data.password,
        cPassword: data.cPassword,
      });
      reset();
      router.push("/signin");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const viewPasswordHandler = () => {
    setViewPassword((prev) => !prev);
  };

  return (
    <div className="bg-white grid gap-3 w-[calc(100vw-30px)] sm:w-[450px] relative rounded-3xl p-5 py-10 sm:p-10">
      <Link
        href="/forgot-password"
        className="flex items-center gap-1 absolute top-5 left-5 text-text w-fit bg-[#FAFAFA] px-3 py-2 rounded-sm"
      >
        <IoIosArrowBack /> Back
      </Link>
      <h1 className="text-xl font-medium mx-auto text-nowrap text-text">
        Reset Password
      </h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <FormField
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={viewPassword ? "text" : "password"}
                      placeholder="Enter Password"
                    />
                    {viewPassword ? (
                      <AiOutlineEye
                        onClick={viewPasswordHandler}
                        className="cursor-pointer text-secondary-foreground/40 text-2xl absolute right-3 top-1/2 transform -translate-y-1/2"
                      />
                    ) : (
                      <RxEyeClosed
                        onClick={viewPasswordHandler}
                        className="cursor-pointer text-secondary-foreground/40 text-xl absolute right-3 top-1/2 transform -translate-y-1/2"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={control}
            name="cPassword"
            rules={{
              required: "Confirm Password is required",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={viewPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="rounded-md "
            type="submit"
            disabled={form.formState.isSubmitting} // Automatically tracks form state
          >
            {form.formState.isSubmitting ? "Submitting..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPassword;
