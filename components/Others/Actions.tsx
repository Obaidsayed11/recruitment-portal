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
import { usePathname } from "next/navigation";

const Actions: React.FC<ActionsProps> = ({ onUpdate, id, data, onDelete }) => {
  const pathname = usePathname();

  const renderModal = () => {
    if (!pathname) return null;

    if (pathname.includes("admin/manager")) {
      return <UpdateManager id={id} onUpdate={onUpdate} data={data} />;
    } else if (pathname.includes(`/admin/supervisors`)) {
      return <UpdateSupervisors id={id} onUpdate={onUpdate} data={data} />;
    } else if (pathname.includes("/admin/dark-stores")) {
      return <UpdateDarkStore id={id} onUpdate={onUpdate} data={data} />;
    } else if (pathname.includes("/admin/plants")) {
      return <UpdatePlants id={id} onUpdate={onUpdate} data={data} />;
    } else if (pathname.includes("/admin/driverssdf")) {
      return <UpdateDrivers id={id} onUpdate={onUpdate} data={data} />;
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
