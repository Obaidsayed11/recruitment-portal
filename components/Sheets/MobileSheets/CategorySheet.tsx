"use client";
import InputField from "@/components/Form_Fields/InputField";
import {
  ArrowLeft,
  ChevronDown,
  CircleCheck,
  CircleChevronRightIcon,
  CircleQuestionMark,
  CircleUser,
  LogOut,
} from "lucide-react";
import React, { useEffect, useState } from "react";
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
import ItemsSheet from "./ItemsSheet";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/axiosInterceptor";
import { toast } from "sonner";
import { DeliveryOrderProps } from "@/types/interface";
import MarkDispatchSheet from "./MarkDispatchSheet";
import { usePathname } from "next/navigation";

interface CategorySheetProps {
  orderId: string;
  data: any;
  index: number;
}

const CategorySheet: React.FC<CategorySheetProps> = ({
  data,
  index,
  orderId,
}) => {
  console.log(orderId);
  const methods = useForm();
  const { data: session } = useSession();
  const [selectCategory, setSelectCategory] = useState(0);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [categoryData, setCategoryData] = useState<DeliveryOrderProps | null>(
    null
  );

  const handleCategorySelect = (i: number) => {
    setSelectCategory(i);
  };

  const pathName = usePathname();
  const baseUrl = pathName?.startsWith("/dispatcher")
    ? "dc"
    : pathName?.startsWith("/outlet") && "ot";

  const onSubmit = async () => {
    try {
      const response = await apiClient.put(
        `/${baseUrl}/orders/${orderId}/status`
      );
      console.log(response.data);
      if (response.status === 200 || response.status === 201) {
        setIsFirstDialogOpen(true);
        toast.success("Order Dispatched");
      }
    } catch (error: any) {
      setIsFirstDialogOpen(false);
      console.log(error);
      throw new Error("Error: ", error.message);
    }
  };

  useEffect(() => {
    if (!session && isFirstDialogOpen) return;

    const fetchData = async () => {
      const response = await apiClient.get(`/${baseUrl}/orders/${orderId}`);
      console.log("Category Data", response.data.deliveryOrder);
      setCategoryData(response.data.deliveryOrder);
    };
    fetchData();
  }, [baseUrl, isFirstDialogOpen, orderId, session]);

  return (
    <>
      <Sheet open={isFirstDialogOpen} onOpenChange={setIsFirstDialogOpen}>
        <SheetTrigger className="w-full text-left">
          <Button onClick={onSubmit} type="button" className="w-full">
            Start Dispatch
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="gap-0 p-0 w-full">
          <SheetHeader className="p-0">
            <div className="bg-[#F2EB18] sticky top-0 p-4 h-[70px] items-center w-full grid grid-cols-[1fr_20px] gap-2">
              <h2 className="line-clamp-1 flex text-text text-sm items-center gap-2 font-medium">
                <SheetClose>
                  <ArrowLeft size={20} />
                </SheetClose>
                4568741331342657987fsdfsdfsdfsdffsdfsdfsdfsdffsdfsdffsdfsdfsd
              </h2>

              <CircleQuestionMark color="#494949" size={20} />
            </div>
          </SheetHeader>

          <div className="grid grid-cols-2 p-5 gap-2 overflow-auto pb-22">
            <h3 className="text-text font-medium col-span-2 mb-3">Category</h3>

            <ItemsSheet orderId={orderId} data={categoryData} />
          </div>
          <div className="bg-background absolute bottom-0 inset-x-0 p-5 border-t border rounded-t-xl">
            <MarkDispatchSheet orderId={orderId} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CategorySheet;
