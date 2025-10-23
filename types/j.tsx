use client";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil, ChevronDown } from "lucide-react";
import apiClient from "@/lib/axiosInterceptor";
import { toast } from "sonner";

// UI & Type Imports
import { ClientProps, TenantAssignment, User } from "@/types/interface"; // Adjust path if needed
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
import Button from "@/components/Others/Button";
import { Combobox } from "@/components/Others/ComoboboxDynamic";
import EditTenantAssignment from "../Modals/EditModals/EditTenantManagement";
import { useParams, usePathname, useSearchParams } from "next/navigation";

// --- Zod Schema for validation ---
const assignmentSchema = z.object({
  clientId: z.string().min(1, "Please select a client."),
  userId: z.string().min(1, "Please select a user."),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

// --- The Main Component ---
const ManageTenantAssignments = () => {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const userId = useMemo(() => {
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
    if (pathname?.startsWith("/admin/users")) {
      if (typeof window !== "undefined") {
        return searchParams?.get("userId");
      }
    }

    // Default to null if no ID can be found
    return null;
  }, [params?.id, params?.uid, pathname, searchParams]); // Add params.uid to the dependency array

  const [assignments, setAssignments] = useState<TenantAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<TenantAssignment | null>(null);

  // State for the create form
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const methods = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      userId: userId || "",
      clientId: "",
    },
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;
  // --- Data Fetching ---

  // **FIX 1**: This useEffect now ONLY fetches clients.
  // It runs once when the component mounts.
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsRes = await apiClient.get("/filters/clients");
        setClients(clientsRes.data.clients || clientsRes.data);
      } catch (error) {
        toast.error("Failed to fetch clients.");
      }
    };
    fetchClients();
  }, []); // Empty dependency array [] means it runs once.

  // **FIX 2**: This useEffect is now ONLY for fetching assignments.
  // It runs only when `userId` has a value.
  useEffect(() => {
    // Guard clause: Only proceed if userId is available.
    if (!userId) {
      setAssignments([]); // Clear previous assignments if userId is lost
      return;
    }

    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const assignRes = await apiClient.get(`/tenant-assignments/${userId}`);
        setAssignments(assignRes.data.assignments || assignRes.data || []);
      } catch (error) {
        toast.error("Failed to fetch assignments for the user.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [userId]); // This hook correctly depends only on userId.

  const onCreateSubmit: SubmitHandler<AssignmentFormValues> = async (data) => {
    try {
      const response = await apiClient.post("/tenant-assignment", data);
      if (response.status === 201 || response.status === 200) {
        toast.success("Assignment created successfully!");
        setAssignments((prev) => [response.data, ...prev]);
        reset();
        setIsCreateFormVisible(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Creation failed.");
    }
  };

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
      await apiClient.delete(`/tenant-assignments/${selectedAssignment.id}`);
      toast.success("Assignment deleted successfully.");
      setAssignments((prev) =>
        prev.filter((a) => a.id !== selectedAssignment.id)
      );
    } catch (error) {
      toast.error("Failed to delete assignment.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedAssignment(null);
    }
  };

  // if (loading) {
  //   return <div className="p-4">Loading Assignments...</div>;
  // }
  console.log(assignments);
  return (
    <div className="">
      <Card className="bg-secondary shadow-none gap-2 py-4">
        <CardHeader className="p-3 py-0">
          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onCreateSubmit);
              }}
              className="grid mb-4 grid-cols-[1fr_200px] gap-5 items-end w-full"
            >
              <FormField
                control={control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text text-base">
                      Select Client
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        className="w-full"
                        placeholder="Search clients..."
                        options={clients.map((c) => ({
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
                {isSubmitting ? "Creating..." : "Create Assignment"}
              </Button>
            </form>
          </FormProvider>

          <CardTitle className="text-text text-lg">
            Existing Tenant Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 py-0">