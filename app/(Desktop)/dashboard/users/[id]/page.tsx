"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import Button from "@/components/Others/Button";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";
import DateInputField from "@/components/Form_Fields/DateField";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import AssignPermissionsTab from "@/components/Tabs/UserTabs/PermissionsTab";
import AssignGroupsTab from "@/components/Tabs/UserTabs/AssignGroupsTab";
import apiClient from "@/lib/axiosInterceptor";

const UserCreateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(10, "Phone must be valid"),
  // status: z.string().optional(),
  // gender: z.string().optional(),
  // dob: z.string().optional(),
});

type AddUserFormValues = z.infer<typeof UserCreateSchema>;

const userTypes = ["CLIENT", "SYSTEM", "INTERNAL"];
const statuses = ["ACTIVE", "INACTIVE", "SUSPENDED"];
const genders = ["MALE", "FEMALE", "NONE"];

const createOptionsFromArray = (arr: string[]) =>
  arr.map((value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    value,
  }));

const CreateUserRoute = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<AddUserFormValues>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      // // status: "ACTIVE",
      // gender: "NONE",
      // dob: "",
    },
  });

  const { handleSubmit, reset } = methods;

  // Fetch user data if editing existing user
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await apiClient.get(`/user/${userId}`);
          const userData = response.data;
          reset({
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            // status: userData.status || "ACTIVE",
            // gender: userData.gender || "NONE",
            // dob: userData.dob || "",
          });
        } catch (error: any) {
          toast.error("Failed to fetch user data.");
        }
      };
      fetchUser();
    }
  }, [userId, reset]);

  const onSubmit: SubmitHandler<AddUserFormValues> = async (data) => {
    try {
      setIsSubmitting(true);

      // if (userId) {
      //   // Editing existing user
      //   const response = await apiClient.put(`auth/user/${userId}`, data);
      //   toast.success(response.data.message || "User updated successfully");
      // } else {
        // Creating new user
        const response = await apiClient.post("/auth/register", data);
        toast.success(response.data.message || "User created successfully");

        const newUserId = response.data.user.id;
        // router.push(`/dashboard/users/create-user/${newUserId}`);
        params.set()
      // }

    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = createOptionsFromArray(statuses);
  const genderOptions = createOptionsFromArray(genders);

  return (
    <>
      <DynamicBreadcrumb
        links={[{ label: userId ? "Edit User" : "Create User" }]}
      />

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-[calc(100vh-105px)] overflow-y-auto gap-5"
        >
          {/* User Details Section */}
          <section className="bg-white border border-gray-200 rounded-xl p-4 grid gap-5">
            <h2 className="text-xl font-bold text-text">
              {userId ? "Edit User Details" : "New User Details"}
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              <InputField label="Full Name" name="fullName" placeholder="Enter full name" />
              <InputField label="Phone" name="phone" placeholder="Enter phone number" />
              <InputField label="Email" name="email" placeholder="Enter email" />
              {/* <SelectField label="Status" name="status" placeholder="Select status" options={statusOptions} />
              <SelectField label="Gender" name="gender" placeholder="Select gender" options={genderOptions} />
              <DateInputField label="DOB" name="dob" placeholder="Select DOB" />  */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-fit justify-self-end sm:col-span-2 lg:col-span-3"
              >
                {isSubmitting ? (userId ? "Updating..." : "Creating...") : (userId ? "Update User" : "Create User")}
              </Button>
            </div>
          </section>

          {/* Tabs Section */}
          <section className="flex-1 bg-white border border-gray-200 rounded-xl p-2 sm:p-2">
            <Tabs defaultValue="permissions">
              <TabsList className="grid w-full grid-cols-4 mt-0">
                <TabsTrigger className="text-text" value="permissions">
                  Permissions
                </TabsTrigger>
                <TabsTrigger className="text-text" value="groups">
                  Groups
                </TabsTrigger>
              </TabsList>
              <TabsContent value="permissions" className="mt-0 p-0">
                <AssignPermissionsTab />
              </TabsContent>
              <TabsContent value="groups" className="mt-0 p-0">
                <AssignGroupsTab  />
              </TabsContent>
            </Tabs>
          </section>
        </form>
      </FormProvider>
    </>
  );
};

export default CreateUserRoute;
