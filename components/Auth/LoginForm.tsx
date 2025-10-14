"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import CopyRight from "./CopyRight";
import apiClient from "@/lib/axiosInterceptor";
import useFcmToken from "@/hooks/useFCMToken";
import Logo from "../Navbar/Logo";
import Button from "../Others/Button";

const formSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{dispatch9}$/, "Invalid Indian phone number")
    .min(10)
    .max(10),
});

export type ActionType = { type: "SUBMIT" } | { type: "BACK" };
type FormInputs = z.infer<typeof formSchema>;

type DispatchType = {
  dispatch: React.Dispatch<ActionType>;
  setIsLoggedIn: (status: boolean) => void;
};

function LoginForm({ setIsLoggedIn }: DispatchType) {
  const router = useRouter();
  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  const { fcmToken } = useFcmToken();
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (fcmToken) {
      setToken(fcmToken);
    }
  }, [fcmToken]);

  const onSubmit = async (data: FormInputs) => {
    if (isLoading) return; // Prevent multiple API calls

    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/login/otp", {
        phone: data.phone,
        device: "WEB",
        token: token,
      });

      console.log(response.data);

      if (response.status === 200 && response.data.verificationId) {
        // setIsLoggedIn(true);
        router.push(
          `/otp?phone=${data.phone}&verificationId=${response.data.verificationId}`
        );
      } else {
        setError("Invalid response from server. Please try again.");
        // clearQueryParams(); // Clear params if response is invalid
      }
    } catch (error: any) {
      setError("Something went wrong! Please try again.");
      console.error(error);
      // clearQueryParams(); // Clear params on error
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove query parameters from the URL
  // const clearQueryParams = () => {
  //   router.replace("/", undefined); // Removes query params without a page reload
  // };

  return (
    <div className="bg-white grid gap-5 rounded-3xl p-5 sm:min-w-[450px] sm:p-8">
      <div className="grid justify-center gap-2">
        <Logo
          logo={"/foodland-logo.png"}
          companyName={"Foodland"}
          className="w-[150px] h-[100px]"
        />
        <h1 className="text-center text-xl font-medium leading-5 text-nowrap text-text">
          LAST MILE
        </h1>
      </div>

      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Enter phone number"
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.phone?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          {error && (
            <div className="text-red-500 text-xs text-center">{error}</div>
          )}

          <Button
            className="bg-primary  px-4 py-2 text-white disabled:bg-primary/80"
            type="submit"
            disabled={isLoading || form.formState.isSubmitting} // Ensure button is disabled
          >
            {isLoading ? "Please wait..." : "Send OTP"}
          </Button>
        </form>
      </Form>
      <CopyRight />
    </div>
  );
}

export default LoginForm;
