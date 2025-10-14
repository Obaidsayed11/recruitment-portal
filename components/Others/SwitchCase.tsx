"use client"; // Ensure it's a client component

import { usePathname, useSearchParams } from "next/navigation";
import apiClient from "@/lib/axiosInterceptor";
import { CustomSwitch } from "./CustomSwitch";

export function SwitchCase({ id, isActive }: { id: any; isActive: any }) {
  const pathname = usePathname(); // ✅ Get current pathname
  const searchParams = useSearchParams(); // ✅ Get query params
  const tab = searchParams?.get("tab"); // ✅ Extract "tab" value

  // Determine schema based on pathname
  const schema =
    pathname?.startsWith("/quick-craves/") &&
    pathname?.includes("/category/") &&
    pathname?.includes("/items/") &&
    pathname?.includes("/qc-skus")
      ? "sKU" // ✅ More specific case should come first
      : pathname?.includes("/quick-craves/") &&
        pathname?.includes("/category/") &&
        pathname?.includes("/items")
      ? "product"
      : pathname?.includes("/main-categories/") &&
        pathname?.includes("/categories/") &&
        pathname?.includes("/sub-categories/") &&
        pathname?.includes("/products/") &&
        pathname?.includes("/skus")
      ? "sKU"
      : pathname?.includes("/restaurants/") &&
        pathname?.includes("/category/") &&
        pathname?.includes("/items/") &&
        pathname?.includes("/food-skus")
      ? "sKU"
      : pathname?.includes("/main-categories/") &&
        pathname?.includes("/categories/") &&
        pathname?.includes("/sub-categories/") &&
        pathname?.includes("/products")
      ? "product"
      : pathname?.includes("/restaurants/") &&
        pathname?.includes("/category/") &&
        pathname?.includes("/items")
      ? "product"
      : pathname?.includes("/main-categories/") &&
        pathname?.includes("/categories/") &&
        pathname?.includes("/sub-categories")
      ? "subcategory"
      : pathname?.includes("/main-categories/") &&
        pathname?.includes("/categories")
      ? "category"
      : pathname?.includes("/quick-craves/") && pathname?.includes("/category")
      ? "subcategory"
      : pathname?.includes("/restaurants/") && pathname?.includes("/category")
      ? "category"
      : pathname?.includes("restaurants")
      ? "restaurant"
      : pathname?.includes("quick-craves")
      ? "cafe"
      : pathname?.includes("store-orders")
      ? "darkstore"
      : pathname?.includes("brands")
      ? "brand"
      : pathname?.includes("printers")
      ? "printer"
      : pathname?.includes("main-categories")
      ? "mainCategory"
      : pathname?.includes("alerts") && tab === "alert"
      ? "alert"
      : pathname?.includes("alerts") && tab === "notification"
      ? "fCM"
      : pathname?.includes("promotions") && tab === "banners"
      ? "banner"
      : pathname?.includes("promotions") && tab === "coupons"
      ? "promocode"
      : "darkstore"; // Default schema

  const handleToggle = async (checked: boolean): Promise<boolean> => {
    console.log("API Toggle Clicked:", checked, "Schema:", schema);

    try {
      const response = await apiClient.post("/admin/active", {
        id,
        isActive: checked,
        schema,
      });

      if (response.status === 200) {
        console.log("API Request Successful");
        return true; // ✅ Explicitly return `true` on success
      } else {
        console.log("API Request Failed");
        return false; // ❌ Explicitly return `false` on failure
      }
    } catch (error) {
      console.error("API Error:", error);
      return false; // ❌ Return `false` if an error occurs
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <CustomSwitch id={id} isActive={isActive} onToggle={handleToggle} />
    </div>
  );
}
