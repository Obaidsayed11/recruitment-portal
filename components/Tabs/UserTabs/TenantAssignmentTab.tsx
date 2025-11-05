

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil, ChevronDown, Loader2 } from "lucide-react";
import apiClient from "@/lib/axiosInterceptor";
import { toast } from "sonner";

// UI & Type Imports
import { UserProps } from "@/types/usertypes"; // Assuming this is correct
import { TenantAssignment } from "@/types/UserTabs"; // Assuming this is correct
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/Others/Button"; // Assuming a default export for Button
import { Combobox } from "@/components/Others/ComoboboxDemo"; // Assuming Combobox component
import EditTenantAssignment from "@/components/Modals/EditModals/EditTenantManagement"; // Assuming this modal
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { BiTrash } from "react-icons/bi";

// --- Types ---
interface CompanyOption {
  id: string;
  name: string;
}

// Ensure TenantAssignment type is detailed enough to hold nested Company and User info
// NOTE: I'm defining a minimal version here for clarity, but you should use your imported type.
// type TenantAssignment = {
//   id: string;
//   companyId: string;
//   userId: string;
//   Company: { id: string; name: string };
//   User: { id: string; fullName: string; email: string };
// };

// --- Zod Schema for validation ---
const assignmentSchema = z.object({
  companyId: z.string().min(1, "Please select a client."),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;
interface ManageTenantAssignmentsProps {
  // Original prop, though logic now relies on URL params
  userId?: string;
}

// --- The Main Component ---
const ManageTenantAssignments: React.FC<ManageTenantAssignmentsProps> = () => {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Unified logic to get the userId from URL parameters or search params
  const userId = useMemo(() => {
    const idFromParams = params?.id as string;
    const uidFromParams = params?.uid as string;

    if (idFromParams) return idFromParams;
    if (uidFromParams) return uidFromParams;

    if (pathname?.startsWith("/users/create-user")) {
      // Check for 'window' to avoid SSR errors with searchParams?.get
      if (typeof window !== "undefined") {
        return searchParams?.get("userId");
      }
    }
    return null;
  }, [params?.id, params?.uid, pathname, searchParams]);

  const [assignments, setAssignments] = useState<TenantAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<TenantAssignment | null>(null);
  

  // State for the data required for the form (Company/Client list)
  const [companies, setCompanies] = useState<CompanyOption[]>([]);

  const methods = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      companyId: "",
    },
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setError, // Added for potential API validation errors
  } = methods;

  // --- Data Fetching: Companies (Clients) ---
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companyRes = await apiClient.get("/company/filter");
        // FIX 1: Correctly accessing the data array based on your API response structure
        setCompanies(companyRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        toast.error("Failed to fetch clients.");
      }
    };
    fetchCompanies();
  }, []);

  // --- Data Fetching: Assignments for the User ---
  const fetchAssignments = async (currentUserId: string) => {
    setLoading(true);
    try {
      // API call to fetch assignments for the given user ID
      const assignRes = await apiClient.get(
        `/assignment/assignments?userId=${currentUserId}`
      );

      console.log(assignRes.data,"assssssiggggg");
      // Assuming the assignments list is in assignRes.data.data or assignRes.data
      const data = assignRes.data.data || assignRes.data;
      setAssignments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      toast.error("Failed to fetch assignments for the user.");
    } finally {
      setLoading(false);
    }
  };
  console.log(companies,"compaaaaannyyy")

  useEffect(() => {
    // Guard clause: Only proceed if userId is available.
    if (!userId) {
      setAssignments([]); // Clear previous assignments if userId is lost
      setLoading(false);
      return;
    }
    fetchAssignments(userId);
  }, [userId]); // This hook correctly depends only on userId.

  
  // --- Form Submission: Create Assignment ---
  const onCreateSubmit: SubmitHandler<AssignmentFormValues> = async (data) => {
    if (!userId) {
      toast.error("User ID is missing. Cannot create assignment.");
      return;
    }
    try {
      console.log(data,"DATTAAAAA")
      const response = await apiClient.post("/assignment/assignment", {
        companyId:data.companyId,
        userId: userId,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Assignment created successfully!");
        // FIX 3: Use response.data.data to get the created assignment object
        setAssignments((prev) => [response.data.data, ...prev]);
        reset(); // Clear the form
      }
    } catch (error: any) {
      console.error("Assignment creation failed:", error);
      toast.error(error.response?.data?.message || "Creation failed.");
    }
  };


  console.log(assignments,"asssssiiiiiddfff")

  // --- CRUD Handlers (Update/Delete) ---

  // UPDATE
  const handleEditClick = (assignment: TenantAssignment) => {
    setSelectedAssignment(assignment);
    setIsEditDialogOpen(true);
  };
  const handleUpdateSuccess = (updatedAssignment: TenantAssignment) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a))
    );
  };

  // DELETE
  const handleDeleteClick = (assignment: TenantAssignment) => {
    setSelectedAssignment(assignment);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedAssignment) return;
    try {
      await apiClient.delete(
        `/assignment/assignments/${selectedAssignment.id}`
      );
      toast.success("Assignment deleted successfully.");
      setAssignments((prev) =>
        prev.filter((a) => a.id !== selectedAssignment.id)
      );
    } catch (error) {
      console.error("Deletion failed:", error);
      toast.error("Failed to delete assignment.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedAssignment(null);
    }
  };

  // --- Render ---

  if (!userId) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: No User ID found to manage assignments.
      </div>
    );
  }

  return (
    <div className="">
      <Card className="bg-secondary shadow-none gap-2 py-4">
        <CardHeader className="p-3 py-0">
          {/* Create Assignment Form */}
          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // <-- This was missing
                handleSubmit(onCreateSubmit); // <--- This calls the function but doesn't handle the submit event itself
              }} // Cleaned up onSubmit handler
              className="grid mb-4 grid-cols-[1fr_200px] gap-5 items-end w-full"
            >
              <FormField
                control={control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text text-base">
                      Select Client
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        className="w-full"
                        placeholder="Search clients..."
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
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-fit"
                onClick={handleSubmit(onCreateSubmit)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Assignment"
                )}
              </Button>
            </form>
          </FormProvider>

          <CardTitle className="text-text text-lg">
            Existing Tenant Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 py-0">
          {loading && userId ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Loading Assignments...</span>
            </div>
          ) : assignments.length === 0 ? (
            <div className="p-4 text-center text-subtext">
              No assignments found for this user.
            </div>
          ) : (
            // Assignment Table
            <Table>
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {/* FIX 4: Mapping over assignments, not companies */}
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    {/* FIX 5: Displaying Company/Client name */}
                    <TableCell>{assignment.Company?.name || "N/A"}</TableCell>
                    {/* Displaying User name */}
                    <TableCell>{assignment.User?.fullName || "N/A"}</TableCell>
                    <TableCell className="text-right mx-auto flex gap-2 justify-end">
                     <button className="w-fit rounded-md transition-all ease-linear text-primary hover:text-white bg-white p-2 text-2xl hover:bg-primary"
                        onClick={() => handleEditClick(assignment)}
                        title="Edit Assignment"
                      >
                        <Pencil />
                      </button>
                      <button
                       className="rounded-md cursor-pointer transition-all ease-linear text-red-500 hover:text-white bg-transparent p-2 text-2xl hover:bg-red-500"
                        onClick={() => handleDeleteClick(assignment)}
                        title="Delete Assignment"
                      >
                       <BiTrash className=" text-2xl " />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditTenantAssignment
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        assignment={selectedAssignment}
        onUpdateSuccess={handleUpdateSuccess}
        companies={companies}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-text">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-subtext">
              This action is permanent. Are you sure you want to delete this
              assignment: **{selectedAssignment?.Company?.name}**?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageTenantAssignments;
