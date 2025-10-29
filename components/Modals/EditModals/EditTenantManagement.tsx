import React, { useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/lib/axiosInterceptor";
import { toast } from "sonner";

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
import { Pencil } from "lucide-react";

// FIX 1: Change schema to use companyId (not clientId)
const tenantAssignmentSchema = z.object({
  companyId: z.string().min(1, "Please select a client."),
});

type AssignmentFormValues = z.infer<typeof tenantAssignmentSchema>;

export interface Client {
  id: string;
  name: string;
}

interface EditAssignmentProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  assignment: TenantAssignment | null;
  onUpdateSuccess: (updatedAssignment: TenantAssignment) => void;
  companies: Client[];
}

const EditTenantAssignment: React.FC<EditAssignmentProps> = ({
  isOpen,
  onOpenChange,
  assignment,
  onUpdateSuccess,
  companies,
}) => {
  const methods = useForm<AssignmentFormValues>({
    resolver: zodResolver(tenantAssignmentSchema),
    defaultValues: {
      companyId: "",
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  // FIX 2: Populate form when dialog opens
  useEffect(() => {
    if (assignment && isOpen) {
      reset({
        companyId: assignment.companyId || "",
      });
    }
  }, [assignment, isOpen, reset]);

  const onSubmit: SubmitHandler<AssignmentFormValues> = async (data) => {
    if (!assignment) {
      toast.error("No assignment selected");
      return;
    }

    try {
      const payload = {
        companyId: data.companyId, // FIX 3: Use companyId not clientId
        userId: assignment.userId,
      };

      console.log("Update payload:", payload);

      // FIX 4: Use correct API endpoint
      const response = await apiClient.put(
        `/assignment/assignments/${assignment.id}`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Assignment updated successfully!");

        // FIX 5: Update with proper company info
        const updatedAssignment = {
          ...assignment,
          companyId: data.companyId,
          Company: companies.find((c) => c.id === data.companyId) || assignment.Company,
        };

        onUpdateSuccess(updatedAssignment);
        onOpenChange(false); // FIX 6: Close using prop, not state
        reset();
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update assignment.");
    }
  };

  return (
    <DialogModal
      open={isOpen}
      onOpenChange={onOpenChange} // FIX 7: Use prop directly
      title="Edit Tenant Assignment"
      
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Company Selection */}
          <FormField
            control={control}
            name="companyId" // FIX 8: Changed from clientId to companyId
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

          {/* User Info Display (Read-only) */}
          {/* <div className="p-3 bg-gray-50 rounded-md border">
            <p className="text-sm text-gray-600 mb-1">Assigned User</p>
            <p className="font-medium text-gray-900">
              {assignment?.User?.fullName || "N/A"}
            </p>
            <p className="text-sm text-gray-500">{assignment?.User?.email || ""}</p>
          </div> */}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Assignment"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </DialogModal>
  );
};

export default EditTenantAssignment;