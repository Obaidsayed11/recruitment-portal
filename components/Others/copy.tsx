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
import { usePathname, useSearchParams } from "next/navigation";
import EditOutlet from "../Modals/EditModals/EditLocation";
import { ActionsProps } from "@/types/interface";
import EditCategory from "../Modals/EditModals/EditCategory";
import EditProduct from "../Modals/EditModals/EditProducts";
import EditDriver from "../Modals/EditModals/EditDrivers";
import EditManager from "../Modals/EditModals/EditManager";
import EditAgent from "../Modals/EditModals/EditAgent";
import EditTicket from "../Modals/EditModals/EditTicket";
import EditVehicle from "../Modals/EditModals/EditVehicle";
import EditClient from "../Modals/EditModals/EditClient";
import EditRole from "../Modals/EditModals/EditRole";
import EditStatus from "../Modals/EditModals/EditStatus";
import EditModule from "../Modals/EditModals/EditModule";
import EditUser from "../Modals/EditModals/EditUser";
import { hasPermission } from "@/utils/hasPermission";
import EditLocation from "../Modals/EditModals/EditLocation";
import EditSync from "../Modals/EditModals/EditErpSync";
import EditStatusTransition from "../Modals/EditModals/EditStatusTransiton";

const Actions: React.FC<ActionsProps> = ({
  onUpdate,
  id,
  isDelete = true, // Default to true
  data,
  onDelete,
  permissions = [],
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getEntityType = () => {
    if (!pathname) return "unknown";

    // Add debugging for ERP Sync
    const tabsParam = searchParams?.get("tabs");

    if (pathname.includes("/admin/clients")) return "client";
    if (
      pathname.includes("/admin/t/") &&
      pathname.includes("/modules/lastmile/locations")
    )
      return "shipment";
    if (/^\/admin\/t\/.*\/users$/.test(pathname)) return "user";
    if (/^\/admin\/t\/.*\/locations$/.test(pathname)) return "location";
    if (
      /^\/admin\/t\/[^/]+\/modules\/ticket-management\/tickets$/.test(pathname)
    )
      return "ticket";
    if (pathname.endsWith(`/admin/warehouses`)) return "warehouse";
    if (/^\/admin\/t\/.*\/categories$/.test(pathname)) return "category";
    if (/^\/admin\/t\/.*\/products$/.test(pathname)) return "product";
    if (
      /^\/admin\/t\/[^/]+\/settings$/.test(pathname) &&
      searchParams?.get("tabs") === "Roles"
    )
      return "role";
    if (
      /^\/admin\/t\/[^/]+\/settings$/.test(pathname) &&
      searchParams?.get("tabs") === "Groups"
    )
      return "group";
    if (
      /^\/admin\/t\/[^/]+\/settings$/.test(pathname) &&
      searchParams?.get("tabs") === "Status"
    )
      return "status";
    if (
      /^\/admin\/t\/[^/]+\/settings$/.test(pathname) &&
      searchParams?.get("tabs") === "Status Transition"
    )
      return "status_transition";
    // ?? Fixed ERP Sync condition
    if (
      /^\/admin\/t\/[^/]+\/settings$/.test(pathname) &&
      searchParams?.get("tabs") === "ERP Sync"
    )
      return "erp_sync";
    if (
      pathname.includes("/admin/system-settings") &&
      searchParams?.get("tabs") === "Modules"
    )
      return "module";
    if (
      pathname.includes("/admin/system-settings") &&
      searchParams?.get("tabs") === "Roles"
    )
      return "role";
    if (pathname.includes("/admin/drivers")) return "driver";
    if (pathname.includes("/admin/managers")) return "manager";
    if (
      pathname.includes("/admin/agents") ||
      pathname.includes("/manager/agents")
    )
      return "agent";
    if (/^\/admin\/t\/.*\/vehicles$/.test(pathname)) return "vehicle";
    if (
      pathname.includes("/admin/tickets") ||
      pathname.startsWith("/manager/tickets")
    )
      return "ticket";

    return "unknown";
  };


  const entityType = getEntityType();

  const canUpdate = hasPermission(permissions, `edit_${entityType}`);
  const canDelete = hasPermission(permissions, `delete_${entityType}`);

  const renderModal = () => {
    if (!pathname) return null;

    if (pathname.includes("/admin/clients")) {
      return <EditClient id={id} onUpdate={onUpdate} data={data} />;
    } else if (/^\/admin\/t\/.*\/users$/.test(pathname)) {
      // return <EditUser id={id} onUpdate={onUpdate} data={data} />;
    } else if (
      /^\/admin\/t\/.*\/settings$/.test(pathname) &&
      searchParams?.get("tabs") === "ERP Sync"
    ) {
      // ?? Fixed ERP Sync modal rendering
      return <EditSync id={id} onUpdate={onUpdate} data={data} />;
    } else if (
      /^\/admin\/t\/.*\/settings$/.test(pathname) &&
      searchParams?.get("tabs") === "Status Transition"
    ) {
      return <EditStatusTransition id={id} onUpdate={onUpdate} data={data} />;
    } else if (/^\/admin\/t\/.*\/locations$/.test(pathname)) {
      return <EditLocation id={id} onUpdate={onUpdate} data={data} />;
    } else if (
      /^\/admin\/t\/[^/]+\/modules\/ticket-management\/tickets$/.test(pathname)
    ) {
      return <EditTicket data={data} id={id} onUpdate={onUpdate} />;
      // } else if (pathname.endsWith(`/admin/warehouses`)) {
      //   return <EditWarehouse id={id} onUpdate={onUpdate} data={data} />;
    } else if (/^\/admin\/t\/.*\/categories$/.test(pathname)) {
      return <EditCategory id={id} onUpdate={onUpdate} data={data} />;
    } else if (/^\/admin\/t\/.*\/products$/.test(pathname)) {
      return <EditProduct id={id} onUpdate={onUpdate} data={data} />;
    } else if (
      /^\/admin\/t\/[^/]+\/settings$/.test(pathname) &&
      searchParams?.get("tabs") === "Roles"
    ) {
      return <EditRole id={id} onUpdate={onUpdate} data={data} />;
    } else if (
      /^\/admin\/t\/[^/]+\/settings$/.test(pathname) &&
      searchParams?.get("tabs") === "Status"
    ) {
      return <EditStatus id={id} onUpdate={onUpdate} data={data} />;
    } else if (pathname.includes("/admin/drivers")) {
      return <EditDriver id={id} onUpdate={onUpdate} data={data} />;
    } else if (
      pathname.includes("/admin/system-settings") &&
      searchParams?.get("tabs") === "Modules"
    ) {
      return <EditModule id={id} onUpdate={onUpdate} data={data} />;
    } else if (
      pathname.includes("/admin/system-settings") &&
      searchParams?.get("tabs") === "Roles"
    ) {
      return <EditRole id={id} onUpdate={onUpdate} data={data} />;
    } else if (pathname.includes("/admin/managers")) {
      return <EditManager id={id} onUpdate={onUpdate} data={data} />;
    } else if (
      pathname.includes("/admin/agents") ||
      pathname.includes("/manager/agents")
    ) {
      return <EditAgent id={id} onUpdate={onUpdate} data={data} />;
    } else if (/^\/admin\/t\/.*\/vehicles$/.test(pathname)) {
      return <EditVehicle id={id} onUpdate={onUpdate} data={data} />;
    } else if (
      pathname.includes("/admin/tickets") ||
      pathname.startsWith("/manager/tickets")
    ) {
      return <EditTicket id={id} onUpdate={onUpdate} data={data} />;
    }

    return null;
  };

  // If user has no permissions for edit or delete, don't show any actions
  if (!canUpdate && !canDelete) {
    console.log("No permissions - hiding actions");
    return null;
  }

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex justify-center justify-self-center gap-2"
      >
        {/* Edit Button - Only show if user has update permission */}
        {canUpdate && renderModal()}

        {/* Delete Button - Only show if isDelete is true AND user has delete permission */}
        {isDelete && canDelete && (
          <AlertDialog>
            <AlertDialogTrigger>
              <button className="rounded-md cursor-pointer transition-all ease-linear text-red-500 hover:text-white bg-transparent p-2 text-2xl hover:bg-red-500">
                <BiTrash className=" text-2xl " />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent></AlertDialogContent>
            </div>
            </>
        )
    }