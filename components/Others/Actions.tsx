import React, { useState } from "react";
import { BiTrash, BiEditAlt } from "react-icons/bi";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ActionsProps } from "@/types/interface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EditUser from "../Modals/EditModals/EditUser";
import EditCompany from "../Modals/EditModals/EditCompany";
import EditJobDescription from "../Modals/EditModals/EditJobDescription";
import EditApplication from "../Modals/EditModals/EditApplication";
import EditDepartment from "../Modals/EditModals/EditDepartment";
import EditGroups from "../Modals/EditModals/EditGroups";
import EditRoles from "../Modals/EditModals/EditRoles";
import { Pencil } from "lucide-react";

const Actions: React.FC<ActionsProps> = ({ onUpdate, id, data, onDelete }) => {
  const pathname = usePathname();
   const router = useRouter();
  

  const searchParams = useSearchParams();

 const tabParam = searchParams?.get("tab");

 // Handle edit button click for users - navigate instead of modal
  const handleEditClick = () => {
    console.log("Actions - pathname:", pathname);
    console.log("Actions - tabsParam:", tabParam);
    console.log("Actions - id:", id);
    
    // If we're on the users page, navigate to the edit page
    if (pathname?.includes("/dashboard/users")) {
      router.push(`/dashboard/users/update-user/${id}`);
      return;
    }
    
    // For other pages, the edit button will open the modal (handled by renderModal)
  };


  const renderModal = () => {
    if (!pathname) return null;
      console.log("Actions - pathname:", pathname);
    console.log("Actions - tabsParam:", tabParam);
    console.log("Actions - data:", data);
    // Add debugging for ERP Sync

    // if (pathname.includes("admin/manager")) {
    //   return <UpdateManager id={id} onUpdate={onUpdate} data={data} />;
    // } else if (pathname.includes(`/admin/supervisors`)) {
    //   return <UpdateSupervisors id={id} onUpdate={onUpdate} data={data} />;
    // } else if (pathname.includes("/admin/dark-stores")) {
    //   return <UpdateDarkStore id={id} onUpdate={onUpdate} data={data} />;
    // } else if (pathname.includes("/admin/plants")) {
    //   return <UpdatePlants id={id} onUpdate={onUpdate} data={data} />;
    // } else if (pathname.includes("/admin/driverssdf")) {
    //   return <UpdateDrivers id={id} onUpdate={onUpdate} data={data} />;
    // }
    if (pathname.includes("/dashboard/users")) {
      return (
        <button  onClick={handleEditClick}>
        <Pencil size={18} />
        </button>
      );
    }
    else if (
      /^\/dashboard\/AdminCompanies\/[^/]+$/.test(pathname) &&
      tabParam === "job-description"
    ) {
      return <EditJobDescription id={id} onUpdate={onUpdate} data={data} />;
    } 
    else if (
      /^\/dashboard\/AdminCompanies\/[^/]+$/.test(pathname) &&
      tabParam === "application"
    ) {
      return <EditApplication id={id} onUpdate={onUpdate} data={data} />;
    } 
    else if (
      /^\/dashboard\/AdminCompanies\/[^/]+$/.test(pathname) &&
      tabParam === "department"
    ) {
      return <EditDepartment id={id} onUpdate={onUpdate} data={data} />;
    }
    
    // Match: /dashboard/AdminCompanies (company list page, no ID)
    else if (pathname === "/dashboard/AdminCompanies") {
      return <EditCompany id={id} onUpdate={onUpdate} data={data} />;
    }
     else if (pathname === "/dashboard/AdminSettings" && tabParam === "groups") {
  return <EditGroups id={id} onUpdate={onUpdate} data={data} />;
}
else if (pathname === "/dashboard/AdminSettings" && tabParam === "roles") {
  return <EditRoles id={id} onUpdate={onUpdate} data={data} />;
}


    return null;
  };


  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex justify-center gap-2"
      >
        {renderModal()}
        <AlertDialog>
          <AlertDialogTrigger>
            <button className="rounded-md cursor-pointer transition-all ease-linear text-red-500 hover:text-white bg-transparent p-2 text-2xl hover:bg-red-500">
              <BiTrash className=" text-2xl " />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-500"
                onClick={onDelete} // Call the delete function when confirmed
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default Actions;
