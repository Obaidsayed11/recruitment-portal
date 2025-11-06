// import React, { useState } from "react";
// import { BiTrash, BiEditAlt } from "react-icons/bi";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { ActionsProps } from "@/types/interface";
// import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
// // import EditUser from "../Modals/EditModals/EditUser";
// import EditCompany from "../Modals/EditModals/EditCompany";
// import EditJobDescription from "../Modals/EditModals/EditJobDescription";
// import EditApplication from "../Modals/EditModals/EditApplication";
// import EditDepartment from "../Modals/EditModals/EditDepartment";
// import EditGroups from "../Modals/EditModals/EditGroups";
// import EditRoles from "../Modals/EditModals/EditRoles";
// import { Pencil } from "lucide-react";
// import Button from "./Button";

// const Actions: React.FC<ActionsProps> = ({ onUpdate, id, data, onDelete, permissions = [] }) => {
//   const pathname = usePathname();
//    const params = useParams() as { companyId: string };
//         const companyId = params.companyId;
//    const router = useRouter();
  

//   const searchParams = useSearchParams();

//  const tabParam = searchParams?.get("tab");

//  // Handle edit button click for users - navigate instead of modal
//   const handleEditClick = () => {
//     console.log("Actions - pathname:", pathname);
//     console.log("Actions - tabsParam:", tabParam);
//     console.log("Actions - id:", id);
    
//     // If we're on the users page, navigate to the edit page
//     if (pathname?.includes("/dashboard/users")) {
//       router.push(`/dashboard/users/update-user/${id}`);
//       return;
//     }
    
//     // For other pages, the edit button will open the modal (handled by renderModal)
//   };

//    const handleEditAppClick = () => {
//     console.log("Actions - pathname:", pathname);
//     console.log("Actions - tabsParam:", tabParam);
//     console.log("Actions - id:", id);
//     console.log("Actions - companyId:", companyId);
    
//     // If we're on the company applications tab, navigate to the edit page
//     if (pathname?.includes("/dashboard/companies") && tabParam === "application") {
//        router.push(`/dashboard/companies/${companyId}/company/application/${id}/update-application`);
//       return;
//     }
    
//     // For other pages, the edit button will open the modal (handled by renderModal)
//   };



//  const handleEditJobClick = () => {


//   if (pathname?.includes("/dashboard/companies") && tabParam === "job-description") {
  
//     router.push(`/dashboard/companies/${companyId}/company/job-descriptions/${id}/update-jobs`);
//   }
// };


//   const renderModal = () => {
//     if (!pathname) return null;
//       console.log("Actions - pathname:", pathname);
//     console.log("Actions - tabsParam:", tabParam);
//     console.log("Actions - data:", data);
//     // Add debugging for ERP Sync

//     // if (pathname.includes("admin/manager")) {
//     //   return <UpdateManager id={id} onUpdate={onUpdate} data={data} />;
//     // } else if (pathname.includes(`/admin/supervisors`)) {
//     //   return <UpdateSupervisors id={id} onUpdate={onUpdate} data={data} />;
//     // } else if (pathname.includes("/admin/dark-stores")) {
//     //   return <UpdateDarkStore id={id} onUpdate={onUpdate} data={data} />;
//     // } else if (pathname.includes("/admin/plants")) {
//     //   return <UpdatePlants id={id} onUpdate={onUpdate} data={data} />;
//     // } else if (pathname.includes("/admin/driverssdf")) {
//     //   return <UpdateDrivers id={id} onUpdate={onUpdate} data={data} />;
//     // }
//     if (pathname.includes("/dashboard/users")) {
//       return (
//      <button 
//   onClick={handleEditClick} 
//   className="w-fit rounded-md transition-all ease-linear text-primary hover:text-white bg-white p-2 text-2xl hover:bg-primary"
// >
//   <Pencil size={18}  />
// </button>
//       );
//     }
  
//     else if (
//       /^\/dashboard\/companies\/[^/]+$/.test(pathname) &&
//       tabParam === "application"
//     ) {
//       return (
//      <button 
//   onClick={handleEditAppClick} 
//   className="w-fit rounded-md transition-all ease-linear text-primary hover:text-white bg-white p-2 text-2xl hover:bg-primary"
// >
//   <Pencil size={18}  />
// </button>
//       );
//     } 
//        else if (
//       /^\/dashboard\/companies\/[^/]+$/.test(pathname) &&
//       tabParam === "job-description"
//     ) {
//      return (
//      <button 
//   onClick={handleEditJobClick} 
//   className="w-fit rounded-md transition-all ease-linear text-primary hover:text-white bg-white p-2 text-2xl hover:bg-primary"
// >
//   <Pencil size={18}  />
// </button>
//       );
//     }
//     else if (
//       /^\/dashboard\/companies\/[^/]+$/.test(pathname) &&
//       tabParam === "department"
//     ) {
//       return <EditDepartment id={id} onUpdate={onUpdate} data={data} />;
//     }
    
//     // Match: /dashboard/companies (company list page, no ID)
//     else if (pathname === "/dashboard/companies") {
//       return <EditCompany id={id} onUpdate={onUpdate} data={data} />;
//     }
//      else if (pathname === "/dashboard/AdminSettings" && tabParam === "groups") {
//   return <EditGroups id={id} onUpdate={onUpdate} data={data} />;
// }
// else if (pathname === "/dashboard/AdminSettings" && tabParam === "roles") {
//   return <EditRoles id={id} onUpdate={onUpdate} data={data} />;
// }


//     return null;
//   };


//   return (
//     <>
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="flex justify-center gap-2"
//       >
//         {renderModal()}
//         <AlertDialog>
//           <AlertDialogTrigger>
//             <button className="rounded-md cursor-pointer transition-all ease-linear text-red-500 hover:text-white bg-transparent p-2 text-2xl hover:bg-red-500">
//               <BiTrash className=" text-2xl " />
//             </button>
//           </AlertDialogTrigger>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be undone. This will permanently delete your
//                 account and remove your data from our servers.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 className="bg-red-500 hover:bg-red-500"
//                 onClick={onDelete} // Call the delete function when confirmed
//               >
//                 Delete
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </>
//   );
// };

// export default Actions;

// import React from "react";
// import { BiTrash } from "react-icons/bi";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
// import EditCompany from "../Modals/EditModals/EditCompany";
// import EditJobDescription from "../Modals/EditModals/EditJobDescription";
// import EditApplication from "../Modals/EditModals/EditApplication";
// import EditDepartment from "../Modals/EditModals/EditDepartment";
// import EditGroups from "../Modals/EditModals/EditGroups";
// import EditRoles from "../Modals/EditModals/EditRoles";
// import { Pencil } from "lucide-react";
// import { ActionsProps } from "@/types/interface";
// import { hasPermission } from "@/lib/hasPermission"; // ✅ import helper

// const Actions: React.FC<ActionsProps> = ({ onUpdate, id, data, onDelete, permissions = [] }) => {
//   const pathname = usePathname();
//   const params = useParams() as { companyId: string };
//   const companyId = params.companyId;
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const tabParam = searchParams?.get("tab");

//   // ✅ Identify entity type dynamically
//   const getEntityType = () => {
//     if (pathname?.includes("/users")) return "user";
//     if (pathname?.includes("/companies") && tabParam === "job-description") return "job";
//     if (pathname?.includes("/companies") && tabParam === "application") return "application";
//     if (pathname?.includes("/companies") && tabParam === "department") return "department";
//     if (pathname === "/companies") return "company";
//     if (pathname === "/settings" && tabParam === "groups") return "group";
//     if (pathname === "/settings" && tabParam === "roles") return "role";
//     return "unknown";
//   };

//   const entityType = getEntityType();

//   // ✅ Permission checks
//   const canUpdate = hasPermission(permissions, `edit_${entityType}`);
//   const canDelete = hasPermission(permissions, `delete_${entityType}`);

//   console.log(canUpdate, canDelete)

  

//   // ✅ Navigation handlers
//   const handleEditClick = () => {
//     if (pathname?.includes("/users")) {
//       router.push(`/users/update-user/${id}`);
//     } 
//      if (pathname?.includes("/companies") && tabParam === "application") {
//       router.push(`/companies/${companyId}/t/applications/update-application/${id}`);
//     } 
//     if (pathname?.includes("/companies") && tabParam === "job-description") {
//       router.push(`/companies/${companyId}/t/jobs/update-jobs/${id}`);
//     }
//   };

//   // ✅ Modal renderer for non-navigation edits
//   const renderModal = () => {
//     if (!pathname) return null;

//     if (pathname?.includes("/users")) {
//       return (
//         <button
//           onClick={handleEditClick}
//           className="w-fit rounded-md transition-all ease-linear text-primary hover:text-white bg-white p-2 text-2xl hover:bg-primary"
//         >
//           <Pencil size={18} />
//         </button>
//       );
//     } else if (
//       /^\/companies\/[^/]+$/.test(pathname) &&
//       tabParam === "department"
//     ) {
//       return <EditDepartment id={id} onUpdate={onUpdate} data={data} />;
//     } else if (pathname === "/companies") {
//       return <EditCompany id={id} onUpdate={onUpdate} data={data} />;
//     } else if (pathname === "/AdminSettings" && tabParam === "groups") {
//       return <EditGroups id={id} onUpdate={onUpdate} data={data} />;
//     } else if (pathname === "/AdminSettings" && tabParam === "roles") {
//       return <EditRoles id={id} onUpdate={onUpdate} data={data} />;
//     }

//     return null;
//   };

//   // ✅ Hide actions if no permission
//   if (!canUpdate && !canDelete) return null;

//   return (
//     <div onClick={(e) => e.stopPropagation()} className="flex justify-center gap-2">
//       {/* ✅ Edit button only if permission */}
//       {canUpdate && renderModal()}

//       {/* ✅ Delete button only if permission */}
//       {canDelete && (
//         <AlertDialog>
//           <AlertDialogTrigger>
//             <button className="rounded-md cursor-pointer transition-all ease-linear text-red-500 hover:text-white bg-transparent p-2 text-2xl hover:bg-red-500">
//               <BiTrash className="text-2xl" />
//             </button>
//           </AlertDialogTrigger>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be undone. This will permanently delete this record.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 className="bg-red-500 hover:bg-red-500"
//                 onClick={onDelete}
//               >
//                 Delete
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       )}
//     </div>
//   );
// };

// export default Actions;

import React from "react";
import { BiTrash } from "react-icons/bi";
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
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import EditCompany from "../Modals/EditModals/EditCompany";
import EditDepartment from "../Modals/EditModals/EditDepartment";
import EditGroups from "../Modals/EditModals/EditGroups";
import EditRoles from "../Modals/EditModals/EditRoles";
import { Pencil } from "lucide-react";
import { ActionsProps } from "@/types/interface";
import { hasPermission } from "@/lib/hasPermission";

const Actions: React.FC<ActionsProps> = ({ onUpdate, id, data, onDelete, permissions = [] }) => {
  const pathname = usePathname();
  const params = useParams() as { companyId: string };
  const companyId = params.companyId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");

  // ✅ Identify entity type dynamically
  const getEntityType = () => {
    if (pathname?.includes("/users")) return "user";
    if (pathname?.includes("/companies") && tabParam === "job-description") return "job";
    if (pathname?.includes("/companies") && tabParam === "application") return "application";
    if (pathname?.includes("/companies") && tabParam === "department") return "department";
    if (pathname === "/companies") return "company";
    if (pathname === "/settings" && tabParam === "groups") return "group";
    if (pathname === "/settings" && tabParam === "roles") return "role";
    return "unknown";
  };

  const entityType = getEntityType();

  // ✅ Permission checks
  const canUpdate = hasPermission(permissions, `edit_${entityType}`);
  const canDelete = hasPermission(permissions, `delete_${entityType}`);

  console.log("Entity Type:", entityType);
  console.log("Can Update:", canUpdate, "Can Delete:", canDelete);
  console.log("Pathname:", pathname, "Tab:", tabParam);

  // ✅ Navigation handlers
  const handleEditClick = () => {
    if (pathname?.includes("/users")) {
      router.push(`/users/update-user/${id}`);
    } else if (pathname?.includes("/companies") && tabParam === "application") {
      router.push(`/companies/${companyId}/t/applications/update-application/${id}`);
    } else if (pathname?.includes("/companies") && tabParam === "job-description") {
      router.push(`/companies/${companyId}/t/jobs/update-jobs/${id}`);
    } else if (pathname?.includes("/settings") && tabParam === "groups") {
      router.push(`/settings/update-group/${id}`);
    }
  };

  // ✅ Modal renderer for non-navigation edits
  const renderEditButton = () => {
    if (!pathname) return null;

    // For users, applications, and job descriptions - use navigation button
    if (
      pathname?.includes("/users") ||
      (pathname?.includes("/companies") && tabParam === "application") ||
      (pathname?.includes("/companies") && tabParam === "job-description")
    ) {
      return (
        <button
          onClick={handleEditClick}
          className="w-fit rounded-md transition-all ease-linear text-primary hover:text-white bg-white p-2 text-2xl hover:bg-primary"
        >
          <Pencil size={18} />
        </button>
      );
    }
    
    // For departments - use modal
    if (
      /^\/companies\/[^/]+$/.test(pathname) &&
      tabParam === "department"
    ) {
      return <EditDepartment id={id} onUpdate={onUpdate} data={data} />;
    }
    
    // For company list - use modal
    if (pathname === "/companies") {
      return <EditCompany id={id} onUpdate={onUpdate} data={data} />;
    }
    
    // For groups - use modal
    if (pathname === "/settings" && tabParam === "groups") {
      return (
        <button
          onClick={handleEditClick}
          className="w-fit rounded-md transition-all ease-linear text-primary hover:text-white bg-white p-2 text-2xl hover:bg-primary"
        >
          <Pencil size={18} />
        </button>
      );
    }
    
    // For roles - use modal
    if (pathname === "/settings" && tabParam === "roles") {
      return <EditRoles id={id} onUpdate={onUpdate} data={data} />;
    }

    return null;
  };

  // ✅ Hide actions if no permission
  if (!canUpdate && !canDelete) return null;

  return (
    <div onClick={(e) => e.stopPropagation()} className="flex justify-center gap-2">
      {/* ✅ Edit button only if permission */}
      {canUpdate && renderEditButton()}

      {/* ✅ Delete button only if permission */}
      {canDelete && (
        <AlertDialog>
          <AlertDialogTrigger>
            <button className="rounded-md cursor-pointer transition-all ease-linear text-red-500 hover:text-white bg-transparent p-2 text-2xl hover:bg-red-500">
              <BiTrash className="text-2xl" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-500"
                onClick={onDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Actions;