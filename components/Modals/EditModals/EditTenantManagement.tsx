import React, { useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/lib/axiosInterceptor";
import { toast } from "sonner";

// UI Imports
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import DialogModal from "@/components/Others/DialogModal";
import Button from "@/components/Others/Button";
import { Combobox } from "@/components/Others/ComoboboxDemo";
import { TenantAssignment } from "@/types/UserTabs";
import { useParams, usePathname, useSearchParams } from "next/navigation";

const tenantAssignmentSchema = z.object({
  clientId: z.string().min(1, "Please select a client."),
  userId: z.string().min(1, "Please select a user."),
});

type AssignmentFormValues = z.infer<typeof tenantAssignmentSchema>;

// For populating the Client combobox
export interface Client {
  id: string;
  name: string;
}

// For populating the User combobox
export interface User {
  id: string;
  fullName: string;
}

interface EditAssignmentProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  assignment: TenantAssignment | null;
  onUpdateSuccess: (updatedAssignment: TenantAssignment) => void;
  companies: Client[]; // Pass the list of companies for the dropdown
}

const EditTenantAssignment: React.FC<EditAssignmentProps> = ({
  isOpen,
  onOpenChange,
  assignment,
  onUpdateSuccess,
  companies
  
}) => {
  // const searchParams = useSearchParams();

  // const userId = searchParams?.get("userId");

  const userId = assignment?.userId;
  console.log(userId);
  
  const methods = useForm<AssignmentFormValues>({
    resolver: zodResolver(tenantAssignmentSchema),
    defaultValues: {
      userId: userId || "",
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  // useEffect(() => {
  //   if (assignment) {
  //     reset({
  //       clientId: assignment.clientId,
  //       userId: userId || "",
  //     });
  //   }
  // }, [assignment, reset, userId]);
  console.log(methods.formState.errors);
  const onSubmit: SubmitHandler<AssignmentFormValues> = async (data) => {
    if (!assignment) return;
    try {
      const payload = {
        ...data,
        userId: userId,
      };

      const response = await apiClient.put(
        `/tenant-assignments/${assignment.id}`,
        payload
      );
      if (response.status === 200 || response.status === 201) {
        reset();
        toast.success("Assignment updated successfully!");
        onUpdateSuccess(response.data.assignment || response.data);
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update assignment."
      );
    }
  };

  return (
    <DialogModal
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Tenant Assignment"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
          }}
          className="space-y-4"
        >
          <FormField
            control={control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Client</FormLabel>
                <FormControl>
                  <Combobox
                    placeholder="Search companies..."
                    options={companies.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    value={field.value}
                    onSelect={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="w-fit justify-self-end col-span-2"
            >
              {isSubmitting ? "Updating..." : "Update user"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default EditTenantAssignment;
