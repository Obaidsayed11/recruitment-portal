"use client";

import { IoIosArrowBack } from "react-icons/io";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/axiosInterceptor";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { getSession, signIn } from "next-auth/react";
import Button from "../Others/Button";
import Logo from "../Navbar/Logo";

interface OtpData {
  pin: string;
}
export type ActionType = { type: "SUBMIT" } | { type: "BACK" };
type DispatchType = {
  dispatch?: React.Dispatch<ActionType>;
};

function Otp({ dispatch }: DispatchType) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // console.log(searchParams,"searc")
  const verificationId = searchParams?.get("verificationId");
  const phone = searchParams ? searchParams.get("phone") : null;

  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);


  const form = useForm<OtpData>({
    defaultValues: {
      pin: "",
    },
    shouldUnregister: true,
  });

  const { handleSubmit, control, formState } = form;

  const onSubmit: SubmitHandler<OtpData> = async (data) => {
    if (isDisabled || formState.isSubmitting) return; // Prevent multiple submissions

    const otpValue = data.pin;
    if (!phone || !verificationId || otpValue.length !== 6) {
      setErrorMessage("Phone or OTP is missing or incomplete!");
      return;
    }

    setIsDisabled(true);
    setErrorMessage(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        phone,
        otp: otpValue,
        verificationId,
      });

      if (result?.error) {
        toast.error("Login Failed", {
          description: result.error || "Something went wrong. Try again.",
        });
        console.error("Login error:", result.error);
        setIsDisabled(false); // Re-enable button on error
        return;
      }

      // Wait for session update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const session = await getSession();
      if (session) {
        toast.success("Login Successful", {
          description: session.user?.fullName,
        });

        // Clear query parameters
        // router.replace(window.location.pathname);
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error occurred.");
      setIsDisabled(false); // Re-enable button on failure
    }
  };

  const handleResendOtp = async () => {
    if (!phone || isResending) return; // Prevent multiple clicks

    setIsResending(true);
    setErrorMessage(null);
    try {
      await apiClient.post("/auth/login/otp", { phone });
      setTimeLeft(60); // Reset timer
      setCanResend(false);
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col bg-white p-4 rounded-3xl relative w-full gap-5 items-center sm:p-10">
      <div className="grid justify-center gap-2">
        <p
          className="flex bg-[#FAFAFA] absolute top-5 left-5 border rounded-sm text-text w-fit gap-1 items-center px-3 py-2 self-start cursor-pointer"
          onClick={() => router.push("/signin")}
        >
          <IoIosArrowBack />
        </p>
        <Logo
          logo={"/lanjekar-holding-logo.png"}
          companyName={"Recruitement-Portal"}
          className="w-[150px] h-[100px]"
        />
        <h1 className="text-center text-xl font-medium leading-5 text-nowrap text-text">
          Enter OTP
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid w-full">
          <FormField
            control={control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormControl className="my-2">
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="mx-auto flex sm:gap-2">
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          className="border"
                          key={index}
                          index={index}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <p className="text-center text-text text-sm my-2">
                  Resend in{" "}
                  <span className="text-blue-500">
                    {Math.floor(timeLeft / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(timeLeft % 60).toString().padStart(2, "0")}
                  </span>{" "}
                  seconds
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 mt-3 items-center">
            {canResend ? (
              <Button
                className="rounded-md w-full"
                onClick={handleResendOtp}
                disabled={isResending}
                type="button"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </Button>
            ) : (
              <Button
                disabled={isDisabled || formState.isSubmitting}
                className="rounded-md w-full"
                type="submit"
              >
                {isDisabled ? "Processing..." : "Submit OTP"}
              </Button>
            )}
          </div>

          {errorMessage && (
            <p className="text-center text-red-500 text-sm">{errorMessage}</p>
          )}
          <p className="text-warning text-center text-xs mt-4">
            <strong className="text-text">Disclaimer:</strong> If you do not
            receive or are unable to submit the OTP, please contact us at{" "}
            <a href="tel:7977646886">7977646886</a> for assistance.
          </p>
        </form>
      </Form>
    </div>
  );
}

export default Otp;
