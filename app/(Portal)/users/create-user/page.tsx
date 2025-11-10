"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
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
// import AssignTenantTab from "@/components/Tabs/UserTabs/AssignTenantTab";
import apiClient from "@/lib/axiosInterceptor";
import ManageTenantAssignments from "@/components/Tabs/UserTabs/TenantAssignmentTab";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Combobox } from "@/components/Others/ComoboboxDemo";
import { useRoles } from "@/hooks/useRoles";
import { hasPermission } from "@/lib/hasPermission";
import { usePermissions } from "@/components/PermissionContext";

const UserCreateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(10, "Phone must be valid"),
  roleId: z.string().min(1, "Please select a Role"),
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
  const pathname = usePathname(); // 2. Get the current URL path
  const searchParams = useSearchParams();
  const {permissions} = usePermissions()

  const { roles, loading, error, refetch } = useRoles();

  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null); // Store user data
  const [userIdData, setUserIdData] = useState(false);
  const methods = useForm<AddUserFormValues>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      roleId: "",
    },
  });

  const { handleSubmit, reset, control } = methods;
  const userId = useMemo(() => {
    // Get both potential IDs from the URL parameters
    const idFromParams = params?.id as string;
    const uidFromParams = params?.uid as string;

    // Priority 1: If an 'id' is in the URL, always use it.
    if (idFromParams) {
      return idFromParams;
    }

    // Priority 2: If no 'id', check for 'uid' in the URL.
    if (uidFromParams) {
      return uidFromParams;
    }

    // Priority 3: If no ID is in the URL, check if the path is for user management
    // and fall back to localStorage (for the create-then-assign flow).
    if (pathname?.endsWith("dashboard/users/create-user")) {
      if (typeof window !== "undefined") {
        return searchParams?.get("userId");
      }
    }

    // Default to null if no ID can be found
    return null;
  }, [params?.id, params?.uid, pathname, userIdData, searchParams]); // Add params.uid to the dependency array;

  console.log(userId, "uswdwedhhdhjhqwjlqjw");

  // Fetch user data if userId exists
  useEffect(() => {
    if (userId && !userData) {
      const fetchUser = async () => {
        // Only fetch if we don't already have the user data
        try {
          setIsLoading(true);
          const response = await apiClient.get(`/user/${userId}`);
          const fetchedUser =
            response.data?.user || response.data?.data || response.data;

          console.log("Full API Response:", response.data); // Debug log
          console.log("Extracted user data:", fetchedUser); // Debug log
          if (fetchedUser) {
            setUserData(fetchedUser);
            console.log(fetchedUser, "fetcdedgwhdwghdghsdDSDsD");

            // Populate the form with fetched user data
            reset({
              fullName: fetchedUser.fullName || fetchedUser.full_name || "",
              email: fetchedUser.email || "",
              phone: fetchedUser.phone || fetchedUser.phoneNumber || "",
              roleId: fetchedUser.roleId || fetchedUser.roleId || "",
            });
          } else {
            toast.error("User data not found in response");
          }
        } catch (error: any) {
          toast.error("Failed to fetch user data.");
          console.error("Fetch user error:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    } else if (userId && userData) {
      // If we already have userData (from registration), just use it
      console.log("Using cached user data:", userData);
      reset({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        roleId: userData.roleId || "",
      });
    } else {
      // Reset form when no userId (creating new user)
      setUserData(null);
      reset({
        fullName: "",
        email: "",
        phone: "",
        roleId: "",
      });
    }
  }, [userId, reset]);

  const onSubmit: SubmitHandler<AddUserFormValues> = async (data) => {
    try {
      setIsSubmitting(true);

      // if (userId) {
      //   // Editing existing user
      //   const response = await apiClient.put(`/user/${userId}`, data);
      //   toast.success(response.data.message || "User updated successfully");
      // } else {
      // Creating new user
      const response = await apiClient.post("/auth/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success(response.data.message || "User created successfully");
      const newUserId = response.data.user.id;
      const createdUser = response.data.user;
      setUserData(createdUser);
      // Populate form with the created user data before navigation
      reset({
        fullName: createdUser.fullName,
        email: createdUser.email || "",
        phone: createdUser.phone || "",
        roleId: createdUser.roleId || "",
      });

      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("userId", newUserId);
      router.replace(`/users/create-user?${searchParams.toString()}`, {
        scroll: false,
      });
      // }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = createOptionsFromArray(statuses);
  const genderOptions = createOptionsFromArray(genders);

  return (
    <>
      <DynamicBreadcrumb
        links={[
          { label: "Users", href: "/users" },
          { label: userId ? "Edit User" : "Create User" },
        ]}
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

            {isLoading ? (
              <div className="text-center py-4">Loading user data...</div>
            ) : (
              <>
                <div className="gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField
                      label="Full Name"
                      name="fullName"
                      placeholder="Enter full name"
                    />
                    <InputField
                      label="Phone"
                      name="phone"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mt-4">
                    <InputField
                      label="Email"
                      name="email"
                      placeholder="Enter email"
                    />

                     {hasPermission(permissions, "assign_user_role") && (
                <FormField
                      control={control}
                      name="roleId"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel className="text-fontPrimary">
                            Roles
                          </FormLabel>
                          <FormControl>
                            <Combobox
                              className="mt-2"
                              placeholder="Select Role"
                              options={roles.map((dep) => ({
                                value: dep.id,
                                label: dep.name.split("_").join(" "),
                              }))}
                              value={field.value}
                              onSelect={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
            )}

                 
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-fit justify-self-end sm:col-span-2 lg:col-span-3 mt-2"
                  >
                    {isSubmitting
                      ? userId
                        ? "Updating..."
                        : "Creating..."
                      : userId
                      ? "Update User"
                      : "Create User"}
                  </Button>
                </div>
              </>
            )}
          </section>

          {/* Tabs Section - Only show when userId exists */}
          <section className="flex-1 bg-white border border-gray-200 rounded-xl p-2 sm:p-2">
            <Tabs defaultValue="permissions">
              <TabsList className="grid w-full grid-cols-3 mt-0">
                <TabsTrigger className="text-text" value="permissions">
                  Permissions
                </TabsTrigger>
                <TabsTrigger className="text-text" value="groups">
                  Groups
                </TabsTrigger>
                <TabsTrigger className="text-text" value="tenants">
                  Tenants
                </TabsTrigger>
              </TabsList>
              <TabsContent value="permissions" className="mt-0 p-0">
                <AssignPermissionsTab />
              </TabsContent>
              <TabsContent value="groups" className="mt-0 p-0">
                <AssignGroupsTab />
              </TabsContent>
              <TabsContent value="tenants" className="mt-0 p-0">
                <ManageTenantAssignments />
              </TabsContent>
            </Tabs>
          </section>
        </form>
      </FormProvider>
    </>
  );
};

export default CreateUserRoute;
