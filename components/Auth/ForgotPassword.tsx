"use client";
import Link from "next/link";
import { LoginData } from "@/types/interface";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axiosInterceptor";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import Button from "../Others/Button";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const form = useForm<LoginData>();
  const router = useRouter();

  const {
    formState: { errors },
    register,
    reset,
    handleSubmit,
  } = form;

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const response = await apiClient.post(`/auth/forgot-password`, {
        phone: data.phone,
      });
      reset(); // Reset the form after successful submission
      router.push(`/otp?email=${data.phone}`); // Redirect to /otp
    } catch (error) {
      console.error("Error submitting forgot password request:", error);
    }
  };

  return (
    <div className="bg-white grid gap-3 w-[calc(100vw-30px)] sm:w-[450px] relative rounded-3xl p-5 py-10 sm:p-10">
      <Link
        href="/signin"
        className="flex items-center gap-1 absolute top-5 left-5 text-text w-fit bg-[#FAFAFA] px-3 py-2 rounded-sm"
      >
        <ArrowLeft /> Back
      </Link>
      <h1 className="text-xl font-medium mx-auto text-nowrap text-text">
        Forgot Password
      </h1>

      <Form {...form}>
        <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="phone">Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" placeholder="Enter Phone" />
                </FormControl>
                <FormDescription>
                  Please enter the Phone associated with your account.
                </FormDescription>
                <FormMessage>{errors.phone?.message}</FormMessage>
              </FormItem>
            )}
          />

          <Button
            className="rounded-md mt-3"
            type="submit"
            disabled={form.formState.isSubmitting} // Automatically tracks form state
          >
            {form.formState.isSubmitting ? "Submitting..." : "Send OTP"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;
