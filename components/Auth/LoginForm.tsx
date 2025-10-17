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
import { signIn } from "next-auth/react";


const formSchema = z.object({
  email: z.string().email("Invalid email address"),
    password: z.string()
    .min(5)
    .max(15),
},
{
      message: "Enter a valid email address password",
    });


export type ActionType = { type: "SUBMIT" } | { type: "BACK" };
type FormInputs = z.infer<typeof formSchema>;

// type DispatchType = {
//   dispatch: React.Dispatch<ActionType>;
//   // setIsLoggedIn: (status: boolean) => void;
// };

function LoginForm() {
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
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting NextAuth signIn...");
      
      // 🚨 CRITICAL FIX: Use signIn() instead of manual apiClient.post()
      const result = await signIn("credentials", {
        // 1. Credentials required by your authorize function
        email: data.email,
        password: data.password,
        token,
        
        // 2. Do not redirect on success, let the client-side handle it after checking the result
        redirect: false, 
      });

      console.log("SignIn Result:", result);

      if (result?.error) {
        // NextAuth will handle errors from your authorize function
        setError(result.error);
      } else if (result?.ok) {
        // If login is successful, NextAuth has set the cookie.
        // The middleware will handle the final redirect to /admin/dashboard or /dashboard.
        console.log("Login successful! Redirecting via router.push");
        router.push("/dashboard"); 
      } else {
         // Should not typically happen if redirect: false
         setError("Login process failed to complete.");
      }

    } catch (error: any) {
      setError("An unexpected error occurred during login.");
      console.error(error);
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter Your Email"
                    // maxLength={10}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter Your Pasword"
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
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
