// "use client";
// import React, { useState } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import apiClient from "@/lib/axiosInterceptor";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { LoginData, UpdatePasswordProps } from "@/types/interface";
// import { Eye, EyeClosed } from "lucide-react";
// import Button from "./Button";

// const passwordSchema = z
//   .object({
//     oldPassword: z.string().nonempty("Old password is required"),
//     password: z.string().min(8, "Password must be at least 8 characters"),
//     cPassword: z.string().min(8, "Confirm Password is required"),
//   })
//   .refine((data) => data.password === data.cPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// const UpdatePassword: React.FC<UpdatePasswordProps> = ({
//   open,
//   onOpenChange,
// }) => {
//   const [viewPassword, setViewPassword] = useState(false);
//   const [apiError, setApiError] = useState<string | null>(null);
//   const form = useForm<LoginData>({
//     resolver: zodResolver(passwordSchema),
//   });

//   const {
//     formState: { errors },
//     handleSubmit,
//     reset,
//     control,
//   } = form;

//   const onSubmit: SubmitHandler<LoginData> = async (data) => {
//     try {
//       const response = await apiClient.put("/auth/change-password", {
//         oldPassword: data.oldPassword,
//         password: data.password,
//         cPassword: data.cPassword,
//       });
//       if (response.status === 201 || response.status === 200) {
//         onOpenChange(false);
//         toast.success(response.data.message);
//       } else {
//         toast.error(response.data.message);
//       }
//       reset();
//     } catch (error) {
//       console.error("Failed to change password", error);
//       setApiError("Failed to change password. Please try again.");
//     }
//   };

//   const viewPasswordHandler = () => {
//     setViewPassword((prev) => !prev);
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogTrigger asChild>
//           <button className="rounded-full w-fit h-fit" />
//         </DialogTrigger>
//         <DialogContent className="rounded-xl w-[calc(100vw-20px)] sm:w-full px-0 py-0 bg-white">
//           <div className="bg-modalHeader py-[20px] px-[30px] border-b border-b-[#E8E8E8] rounded-t-[20px]">
//             <p className="text-primary text-base font-medium">Reset Password</p>
//           </div>
//           <div className="bg-white grid gap-3 rounded-3xl p-5 w-full">
//             {apiError && <div className="text-red-600 mb-2">{apiError}</div>}
//             <Form {...form}>
//               <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
//                 <FormField
//                   control={form.control}
//                   name="oldPassword"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Old Password</FormLabel>
//                       <FormControl>
//                         <Input
//                           type={viewPassword ? "text" : "password"}
//                           placeholder="Enter Old Password"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage>{errors.oldPassword?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>New Password</FormLabel>
//                       <FormControl>
//                         <Input
//                           type={viewPassword ? "text" : "password"}
//                           placeholder="Enter New Password"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage>{errors.password?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={control}
//                   name="cPassword"
//                   render={({ field }) => (
//                     <FormItem className="relative">
//                       <FormLabel>Confirm Password</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Input
//                             type={viewPassword ? "text" : "password"}
//                             placeholder="Confirm New Password"
//                             {...field}
//                           />
//                           {viewPassword ? (
//                             <Eye
//                               onClick={viewPasswordHandler}
//                               className="cursor-pointer text-secondary-foreground/40 text-2xl absolute right-3 bottom-2"
//                             />
//                           ) : (
//                             <EyeClosed
//                               onClick={viewPasswordHandler}
//                               className="cursor-pointer text-secondary-foreground/40 text-2xl absolute right-3 bottom-2"
//                             />
//                           )}
//                         </div>
//                       </FormControl>
//                       <FormMessage>{errors.cPassword?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />
//                 <Button className="rounded-full hover:bg-primary" type="submit">
//                   Reset Password
//                 </Button>
//               </form>
//             </Form>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default UpdatePassword;
