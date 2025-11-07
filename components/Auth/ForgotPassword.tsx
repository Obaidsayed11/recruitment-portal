// "use client";
// import Link from "next/link";
// import { LoginData } from "@/types/interface";
// import React from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import apiClient from "@/lib/axiosInterceptor";
// import {
//   Form,
//   FormField,
//   FormControl,
//   FormItem,
//   FormLabel,
//   FormDescription,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "../ui/input";
// import Button from "../Others/Button";
// import { ArrowLeft } from "lucide-react";

// const ForgotPassword = () => {
//   const form = useForm<LoginData>();
//   const router = useRouter();

//   const {
//     formState: { errors },
//     register,
//     reset,
//     handleSubmit,
//   } = form;

//   const onSubmit: SubmitHandler<LoginData> = async (data) => {
//     try {
//       const response = await apiClient.post(`/auth/forgot-password`, {
//         phone: data.phone,
//       });
//       reset(); // Reset the form after successful submission
//       router.push(`/otp?email=${data.phone}`); // Redirect to /otp
//     } catch (error) {
//       console.error("Error submitting forgot password request:", error);
//     }
//   };

//   return (
//     <div className="bg-white grid gap-3 w-[calc(100vw-30px)] sm:w-[450px] relative rounded-3xl p-5 py-10 sm:p-10">
//       <Link
//         href="/signin"
//         className="flex items-center gap-1 absolute top-5 left-5 text-text w-fit bg-[#FAFAFA] px-3 py-2 rounded-sm"
//       >
//         <ArrowLeft /> Back
//       </Link>
//       <h1 className="text-xl font-medium mx-auto text-nowrap text-text">
//         Forgot Password
//       </h1>

//       <Form {...form}>
//         <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
//           <FormField
//             control={form.control}
//             name="phone"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel htmlFor="phone">Phone</FormLabel>
//                 <FormControl>
//                   <Input {...field} type="tel" placeholder="Enter Phone" />
//                 </FormControl>
//                 <FormDescription>
//                   Please enter the Phone associated with your account.
//                 </FormDescription>
//                 <FormMessage>{errors.phone?.message}</FormMessage>
//               </FormItem>
//             )}
//           />

//           <Button
//             className="rounded-md mt-3"
//             type="submit"
//             disabled={form.formState.isSubmitting} // Automatically tracks form state
//           >
//             {form.formState.isSubmitting ? "Submitting..." : "Send OTP"}
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default ForgotPassword;

// src/app/(your-folder)/ForgotPassword.tsx
"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

import { LoginData } from "@/types/interface";
import apiClient from "@/lib/axiosInterceptor";

import Button from "../Others/Button";
import Logo from "../Navbar/Logo";
import { Input } from "../ui/input";

// Import shadcn's Form components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const ForgotPassword: React.FC = () => {
  const form = useForm<LoginData>({
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const response = await apiClient.post(`/auth/forget-password`, {
        email : data.email,
      });
      reset(); // Reset the form after successful submission
      router.push(`/otp?email=${data.email}`); // Redirect to /otp
    } catch (error : any) {
      toast.error(error.message)
      console.error("Error submitting forgot password request:", error);
      // Optionally, handle error states here
    }
  };

  return (
    <div className="bg-white grid gap-5 w-full sm:w-[500px] rounded-3xl p-5 sm:p-10">
      <Link
        href="/"
        className="flex items-center gap-1 text-fontPrimary w-fit bg-[#FAFAFA] px-3 py-2 rounded-sm"
      >
        <IoIosArrowBack /> Back
      </Link>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 justify-center">
         <Logo
          logo={"/lanjekar-holding-logo.png"}
          companyName={"Recruitement-Portal"}
          // className="w-[150px] h-[100px]"
        />
        <hr className="border-fontPrimary border-r-[1px] h-[40px]" />
        <span className="font-medium text-fontPrimary text-2xl mt-2">
          Forget Password
        </span>
      </div>
      <Form {...form}>
        <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-fontPrimary">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter Email"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="rounded-md mt-3" type="submit">
            Send OTP
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;

