"use client";
import InputField from "@/components/Form_Fields/InputField";
import {
  ArrowLeft,
  ChevronDown,
  CircleChevronRightIcon,
  CircleQuestionMark,
  CircleUser,
  LogOut,
} from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DriversSvg from "@/components/Svgs/DriversSvg";
import DarkStoreSvg from "@/components/Svgs/DarkStore";
import CategorySheet from "./CategorySheet";
import { DeliveryOrder } from "@/types/interface";
import { BACKEND_URL, BASE_URL } from "@/config";
import { getDistanceInKm } from "@/components/Others/distance";

interface DeliveryGoodsSheetProps {
  data: DeliveryOrder;
  index: number;
}

const DeliveryGoodsSheet: React.FC<DeliveryGoodsSheetProps> = ({
  data,
  index,
}) => {
  const methods = useForm();
  const [openDetailView, setOpenDetailView] = useState(false);

  const handleDetailView = () => {
    setOpenDetailView((prev) => !prev);
  };

  const distance = getDistanceInKm(
    data.Warehouse.latitude,
    data.Warehouse.longitude,
    data.Outlet.latitude,
    data.Outlet.longitude
  );

  return (
    <>
      <Sheet>
        <SheetTrigger className="w-full text-left">
          <div
            className={`${
              index % 2 ? "bg-white" : "bg-[#F5F5F5]"
            } grid grid-cols-[1fr_30px] items-center p-3 py-5`}
          >
            <div className="grid gap-2">
              <span className="text-xs text-text">
                Invoice No.:{" "}
                <strong className="font-semibold">
                  {(data.invoiceNo && data.invoiceNo) || "NA"}
                </strong>
              </span>
              <div className="grid grid-cols-2 gap-3">
                <span className="text-xs text-text">
                  From warehouse:{" "}
                  <strong className="block font-semibold">
                    {(data.Warehouse && data.Warehouse.name) || "NA"}
                  </strong>
                </span>
                <span className="text-xs text-text">
                  To Outlet:{" "}
                  <strong className="block font-semibold">
                    {(data.Outlet && data.Outlet.name) || "NA"}
                  </strong>
                </span>
                <span className="text-xs text-text col-span-2">
                  By Driver:{" "}
                  <strong className="ml-2 font-semibold">
                    {(data.Driver && data.Driver.fullName) || "NA"}
                  </strong>
                  <strong className="ml-2 font-semibold">
                    ({(data.Driver && data.Driver.phone) || "NA"})
                  </strong>
                </span>
              </div>
            </div>

            <CircleChevronRightIcon size={25} color="#494949" />
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="gap-0 p-0 w-full">
          <SheetHeader className="p-0">
            <div className="bg-[#F2EB18] sticky top-0 p-4 h-[70px] items-center w-full grid grid-cols-[1fr_20px] gap-2">
              <h2 className="line-clamp-1 flex text-text text-sm items-center gap-2 font-medium">
                <SheetClose>
                  <ArrowLeft size={20} />
                </SheetClose>
                {data.invoiceNo && data.invoiceNo + ""}
              </h2>

              <CircleQuestionMark color="#494949" size={20} />
            </div>
          </SheetHeader>

          <div
            className="bg-secondary sticky top-[70px]"
            onClick={handleDetailView}
          >
            {/* Inner collapsible container */}
            <div
              className={`overflow-hidden transition-all duration-800 ease-in-out${
                openDetailView ? "max-h-full" : "max-h-[70px]"
              }`}
            >
              {/* Top Section */}
              <div
                className={`${
                  openDetailView ? "grid" : "flex justify-between"
                }  px-4 py-2 items-center gap-2`}
              >
                <div className="flex items-center gap-2">
                  <span className="bg-white rounded-full p-3 w-fit h-fit">
                    <DriversSvg />
                  </span>
                  <div className={`${openDetailView ? "grid" : "hidden"} `}>
                    <h4 className="text-primary font-medium text-xs">
                      Warehouse
                    </h4>
                    <p className="text-subtext text-xs">
                      {data.Warehouse && data.Warehouse.address}
                    </p>
                  </div>
                </div>
                <div
                  className={`${
                    openDetailView
                      ? "grid gap-3 pl-5"
                      : "w-full  justify-items-center justify-center flex gap-2"
                  } items-center  `}
                >
                  <span
                    className={` ${
                      openDetailView
                        ? "border-r-2 w-fit  self-center min-h-[40px]"
                        : "border-t-2 h-fit w-full"
                    } border-dotted border-text`}
                  ></span>
                  <span className="text-xs text-text text-wrap">
                    {distance.toFixed(2) || 0} Km
                  </span>
                  <span
                    className={`${
                      openDetailView
                        ? "border-r-2 w-fit min-h-[40px]"
                        : "border-t-2 h-fit w-full"
                    } border-dotted border-text`}
                  ></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white rounded-full p-3 w-fit h-fit">
                    <DarkStoreSvg />
                  </span>
                  <div className={`${openDetailView ? "grid" : "hidden"} `}>
                    <h4 className="text-primary font-medium text-xs">Outlet</h4>
                    <p className="text-subtext text-xs">
                      {data.Outlet && data.Outlet.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow toggle */}
            <ChevronDown
              color="#494949"
              className={`${
                openDetailView ? "rotate-180" : ""
              } mx-auto w-full mb-3 transition-transform duration-300`}
              size={20}
            />
          </div>
          <div className="">
            {data.invoice !== null ? (
              <iframe
                src={BASE_URL + data.invoice}
                title="PDF Preview"
                className="w-full h-[calc(100vh-200px)] border rounded-md"
              />
            ) : (
              "Invoice is not available"
            )}
          </div>
          <div className="bg-background absolute bottom-0 inset-x-0 p-5 border-t border rounded-t-xl">
            <CategorySheet data={undefined} index={0} orderId={data.id} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DeliveryGoodsSheet;
