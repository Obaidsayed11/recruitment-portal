"use client";
import React, { useState, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft, CircleCheck } from "lucide-react";

import { Button } from "../Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/axiosInterceptor";
import { DeliveryOrderProps } from "@/types/interface";
import { usePathname } from "next/navigation";

interface ItemsSheetProps {
  data: DeliveryOrderProps;
  orderId: string;
}

const ItemsSheet: React.FC<ItemsSheetProps> = ({ data, orderId }) => {
  // --- STATE ---
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    data.categories[0]?.categoryId || null
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // 1. New state to track submitted category IDs
  const [submittedCategoryIds, setSubmittedCategoryIds] = useState<string[]>(
    []
  );
  const pathName = usePathname();
  const baseUrl = pathName?.startsWith("/dispatcher")
    ? "dc"
    : pathName?.startsWith("/outlet") && "ot";

  // --- FORM and MEMOIZED DATA ---
  const methods = useForm();
  const activeProducts = useMemo(() => {
    return (
      data.categories.find(
        (category) => category.categoryId === selectedCategoryId
      )?.products || []
    );
  }, [selectedCategoryId, data.categories]);

  // --- HANDLERS ---
  const onSubmit = async (formData: any) => {
    const productsPayload = activeProducts.map((product, index) => ({
      itemId: product.code,
      dispatchQty: parseInt(formData.products[index].dispatchQty, 10) || 0,
    }));

    const finalPayload = {
      deliveryOrderId: orderId,
      categoryId: selectedCategoryId,
      products: productsPayload,
    };

    try {
      const response = await apiClient.put(
        `/${baseUrl}/orders/qty`,
        finalPayload
      );
      if (response.status === 200) {
        toast.success(response.data.message);

        // 2. Add the successfully submitted category ID to our new state
        if (
          selectedCategoryId &&
          !submittedCategoryIds.includes(selectedCategoryId)
        ) {
          setSubmittedCategoryIds((prevIds) => [
            ...prevIds,
            selectedCategoryId,
          ]);
        }

        setIsSheetOpen(false); // Close the sheet on success
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to confirm quantities."
      );
      console.error("Submission Error:", error);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    methods.reset({
      products:
        data.categories
          .find((c) => c.categoryId === categoryId)
          ?.products.map((p) => ({ dispatchQty: p.dispatchQty || 0 })) || [],
    });
    setIsSheetOpen(true);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <div className="flex gap-4">
        {data.categories.map((category) => {
          const isSubmitted = submittedCategoryIds.includes(
            category.categoryId
          );
          const isSelected = selectedCategoryId === category.categoryId;

          return (
            <button
              key={category.categoryId}
              onClick={() => handleCategoryClick(category.categoryId)}
              className={`p-5 w-full rounded-md border self-end relative font-medium transition-colors duration-300
                ${
                  isSelected || isSubmitted
                    ? "bg-primary text-white h-[90px]"
                    : "bg-secondary text-text h-[100px]"
                }`}
            >
              {category.categoryName}
              {isSubmitted && (
                <CircleCheck
                  className="fill-green-500 absolute -top-[10px] right-1"
                  color="#ffffff"
                />
              )}
            </button>
          );
        })}
      </div>

      <SheetContent side="left" className="gap-0 p-0 w-full">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="h-full flex flex-col"
          >
            <SheetHeader className="bg-primary sticky top-0 p-4 h-[70px] items-center w-full">
              <h2 className="line-clamp-1 flex text-white text-sm items-center my-auto self-start gap-2 font-medium">
                <SheetClose>
                  <ArrowLeft size={20} />
                </SheetClose>
                {data.categories.find(
                  (c) => c.categoryId === selectedCategoryId
                )?.categoryName || "Items"}
              </h2>
            </SheetHeader>

            <div className="flex-grow overflow-auto pb-20">
              <div className="bg-primary p-2 sticky top-0 grid grid-cols-[1fr_4fr_1fr_1fr] gap-2">
                <span className="text-white font-medium text-xs text-center">
                  Sr.
                </span>
                <span className="text-white font-medium text-xs">Product</span>
                <span className="text-white font-medium text-xs text-center">
                  Order Qty
                </span>
                <span className="text-white font-medium text-xs text-center">
                  Dispatch Qty
                </span>
              </div>

              {activeProducts.map((product, i) => (
                <div
                  key={product.id}
                  className={`${
                    i % 2 ? "bg-white" : "bg-secondary"
                  } grid grid-cols-[1fr_4fr_1fr_1fr] gap-2 p-2 items-center`}
                >
                  <span className="text-text font-medium text-center text-sm">
                    {i + 1}
                  </span>
                  <div className="flex gap-2 items-start">
                    <Image
                      src={"/default-product.png"}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="object-contain w-[50px] h-[50px] bg-gray-300 rounded-md border"
                    />
                    <div>
                      <h3 className="text-text font-medium text-sm line-clamp-2">
                        {product.name}
                      </h3>
                      <span className="text-subtext font-medium text-xs">
                        Code: {product.code}
                      </span>
                    </div>
                  </div>
                  <div className="grid justify-items-center">
                    <span className="text-text text-sm font-medium">
                      {product.orderQty}
                    </span>
                  </div>
                  <div className="grid justify-items-center">
                    <Input
                      placeholder="0"
                      type="number"
                      className="text-center p-1 h-10 w-full"
                      {...methods.register(`products.${i}.dispatchQty`)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-background absolute bottom-0 inset-x-0 p-5 border-t rounded-t-xl">
              <Button type="submit" className="w-full">
                Confirm Quantity
              </Button>
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default ItemsSheet;
