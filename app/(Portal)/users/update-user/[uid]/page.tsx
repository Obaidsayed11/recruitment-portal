"use client";
import DynamicBreadcrumb from "@/components/Navbar/BreadCrumb";
import apiClient from "@/lib/axiosInterceptor";
import { UserProps } from "@/types/usertypes";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import Button from "@/components/Others/Button";
import InputField from "@/components/Form_Fields/InputField";
import SelectField from "@/components/Form_Fields/SelectField";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Combobox } from "@/components/Others/ComoboboxDemo";
import AssignPermissionsTab from "@/components/Tabs/UserTabs/PermissionsTab";
import AssignGroupsTab from "@/components/Tabs/UserTabs/AssignGroupsTab";
import DateInputField from "@/components/Form_Fields/DateField";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageTenantAssignments from "@/components/Tabs/UserTabs/TenantAssignmentTab";
import { useRoles } from "@/hooks/useRoles";
// import ManageTenantAssignments from "@/components/Tabs/TenantAssignmentTab";



// Schema that properly handles optional email
const UserUpdateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().email().safeParse(val).success,
      {
        message: "Invalid email",
      }
    ),
  phone: z.string().min(10, "Phone must be valid"),
  role: z.string()
});
interface UpdateUserRouteProps {
  userId?: string;
}

type AddUserFormValues = z.infer<typeof UserUpdateSchema>;

const UpdateUserRoute: React.FC<UpdateUserRouteProps> = ({
  userId: propUserId,
}) => {
  //   const [allRoles, setAllRoles] = useState<RoleProps[]>([]);
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [userIdData, setUserIdData] = useState(false);
  const pathname = usePathname(); // 2. Get the current URL path
  const searchParams = useSearchParams();
  const params = useParams();
   const { roles, loading, error, refetch } = useRoles();
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

  const methods = useForm<AddUserFormValues>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "", // Changed from "" to undefined
      role: ""
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  // Effect to fetch the user's current data
  useEffect(() => {
    if (userId && !userData) {
      const fetchUserData = async () => {
        try {
          setIsLoading(true);
          const response = await apiClient.get(`/user/${userId}`);
          const fetchedUser =
            response.data?.user || response.data?.data || response.data;
          console.log(response.data);
          if (fetchedUser) {
            setUserData(fetchedUser);
            console.log(fetchedUser, "fetcdedgwhdwghdghsdDSDsD");
            // Populate the form with fetched user data
            reset({
              fullName: fetchedUser.fullName || fetchedUser.full_name || "",
              email: fetchedUser.email || "",
              phone: fetchedUser.phone || fetchedUser.phoneNumber || "",
               role: fetchedUser.Role?.name || "", // ✅ use id for Combobox value
            });
          } else {
            toast.error("User data not found in response");
          }
        } catch (error: any) {
          toast.error("Failed to fetch user data.");
         } finally {
          setIsLoading(false);
        }
      };
      fetchUserData();
    }else if (userId && userData) {
      // If we already have userData (from registration), just use it
      console.log("Using cached user data:", userData);
      reset({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role: userData.Role?.name || "", // ✅ again use id // Use role's string property
      });
    } else {
      // Reset form when no userId (creating new user)
      setUserData(null);
      reset({
        fullName: "",
        email: "",
        phone: "",
        role: "",
      });
    }
  }, [userId, reset]);

  // Effect to populate the form once userData is fetched
  // useEffect(() => {
  //   if (userData) {
  //     //   const formattedDob = userData.dob
  //     //     ? format(new Date(userData.dob), "yyyy-MM-dd")
  //     //     : "";
  //     const formValues: AddUserFormValues = {
  //       fullName: userData?.fullName || "",
  //       email: userData?.email || undefined, // Changed to handle null/undefined properly
  //       phone: userData?.phone || "",
  //       // gender: userData?.gender || undefined,
  //       // roleId: userData?.Role?.id || undefined,
  //       // dob: formattedDob || undefined,
  //     };
  //     reset(formValues);
  //   }
  // }, [userData, reset]);

  // Effect to fetch the list of all available roles
  //   useEffect(() => {
  //     if (session) {
  //       const fetchRoles = async () => {
  //         try {
  //           const response = await apiClient.get<{ roles: RoleProps[] }>(
  //             `/filters/roles?clientId=${null}`
  //           );
  //         //   setAllRoles(response.data.roles || []);
  //         } catch (error: any) {
  //           toast.error("Failed to fetch roles.");
  //         }
  //       };
  //       fetchRoles();
  //     }
  //   }, [session]);

  const genderOptions = ["MALE", "FEMALE", "NONE", "OTHER"].map((value) => ({
    label: value
      .split("_")
      .map((part) =>
        part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : ""
      )
      .join(" "),
    value,
  }));

  const onSubmit: SubmitHandler<AddUserFormValues> = async (data) => {
    try {
      // Always include email field, explicitly convert empty string to null
      const payload = {
        ...data,
        email: data.email === "" || !data.email ? null : data.email,
      };

      // Log each field individually to debug
      console.log("Form data:", data);
      console.log("Email value:", data.email);
      console.log(
        "Email processed:",
        data.email === "" || !data.email ? null : data.email
      );
      console.log("Cleaned data being sent:", payload);
      console.log("JSON.stringify:", JSON.stringify(payload, null, 2));

      const response = await apiClient.put(`/user/${userId}`, payload);
      if (response.status === 201 && response.data.user) {
        toast.success(response.data.message || "User updated successfully!");
        if (response.data.user) {
          setUserData(response.data.user);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <>
      <DynamicBreadcrumb
        links={[
          { label: "Users", href: "/users" },
          {
            label: "Update User",
          },
        ]}
      />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-[calc(100vh-105px)] overflow-y-auto"
        >
          {/* User Details Section */}
          <section className="bg-white border border-gray-200 rounded-xl p-4 grid gap-5 mb-5">
            <h2 className="text-xl font-bold text-text">User Details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField
                label="Name"
                name={"fullName"}
                placeholder={"Enter full name"}
                formItemClassName="sm:col-span-1"
              />
              <InputField
                label="Phone"
                name={"phone"}
                placeholder={"Enter phone number"}
              />
              <InputField
                label="Email"
                name={"email"}
                placeholder={"Enter email"}
              />
              {/* <DateInputField
                name={"dob"}
                label="DOB"
                placeholder={"Select DOB"}
                formItemClassName="mt-2"
              /> */}
              {/* <FormField
                control={control}
                name="roleId"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel className="text-fontPrimary">Role</FormLabel>
                    <FormControl>
                      <Combobox
                        placeholder="Select Role"
                        options={allRoles.map((role) => ({
                          value: role.id,
                          label: role.name,
                        }))}
                        value={field.value}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
                 <FormField
                              control={control}
                              name="role"
                              render={({ field }) => (
                                <FormItem className="sm:col-span-1">
                                  <FormLabel className="text-fontPrimary">Roles</FormLabel>
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
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-fit justify-self-end col-span-2"
              >
                {isSubmitting ? "Updating..." : "Update user"}
              </Button>
            </div>
          </section>

          {/* Tabs Section */}
          <section
            className={`flex-1 bg-white border border-gray-200 rounded-xl p-2 sm:p-2`}
          >
            <Tabs defaultValue="permissions">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="tenant">Tenant Assignments</TabsTrigger>
              </TabsList>
              <TabsContent value="permissions" className="">
                <AssignPermissionsTab />
              </TabsContent>
              <TabsContent value="groups" className="">
                <AssignGroupsTab />
              </TabsContent>
              {/* <TabsContent value="assignments" className="">
                <ManageAssignments />
              </TabsContent> */}
              <TabsContent value="tenant" className="">
                <ManageTenantAssignments />
              </TabsContent>
            </Tabs>
          </section>
        </form>
      </FormProvider>
    </>
  );
};

export default UpdateUserRoute;
