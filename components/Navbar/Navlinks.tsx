"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardSvg from "../Svgs/DashboardSvg";
import UserSvg from "../Svgs/UserSvg";
import SidebarSkeleton from "../Others/Skeleton3";
import OrderSvg from "../Svgs/OrderSvg";
import ProductSvg from "../Svgs/ProductSvg";
import CompanySvg from "../Svgs/CompanySvg";
import SettingsSvg from "../Svgs/SettingSvg";
import ReportsSvg from "../Svgs/ReportsSvg";


interface NavigationItem {
  name: string;
  link: string;
  icon: (isActive?: boolean) => React.ReactNode;
}

interface NavigationSection {
  heading?: string; // Made optional as some sections might not have a heading
  items: NavigationItem[];
}

type UserRole = "ADMIN" | "OUTLET" | "WAREHOUSE" | "DRIVER"; // Add more roles as needed

// const navigationData: Record<UserRole, NavigationSection[]> = {
//   ADMIN: [
//     {
//       items: [
//         {
//           name: "Dashboard",
//           link: "/admin/dashboard",
//           icon: (isActive) => <DashboardSvg isActive={isActive} />,
//         },
//         {
//           name: "Users",
//           link: "/admin/users",
//           icon: (isActive) => <UserSvg isActive={isActive} />,
//         },
//         {
//           name: "Outlets",
//           link: "/admin/outlets",
//           icon: (isActive) => <DarkStoreSvg isActive={isActive} />,
//         },
//         {
//           name: "Warehouses",
//           link: "/admin/warehouses",
//           icon: (isActive) => <VendorSvg isActive={isActive} />,
//         },
//         {
//           name: "Categories",
//           link: "/admin/categories",
//           icon: (isActive) => <OrderSvg isActive={isActive} />,
//         },
//         {
//           name: "Products",
//           link: "/admin/products",
//           icon: (isActive) => <ProductSvg isActive={isActive} />,
//         },
//         {
//           name: "Drivers",
//           link: "/admin/drivers",
//           icon: (isActive) => <DriversSvg isActive={isActive} />,
//         },
//       ],
//     },
//   ],
//   WAREHOUSE: [
//     {
//       items: [
//         {
//           name: "Delivery",
//           link: "/warehouse",
//           icon: (isActive) => <DashboardSvg isActive={isActive} />,
//         },
//         {
//           name: "Create Order",
//           link: "/warehouse/create",
//           icon: (isActive) => <OrderSvg isActive={isActive} />,
//         },
//       ],
//     },
//   ],
//   OUTLET: [
//     {
//       items: [
//         {
//           name: "Dashboard",
//           link: "/outlet/dashboard",
//           icon: (isActive) => <DashboardSvg isActive={isActive} />,
//         },
//         {
//           name: "Categories",
//           link: "/outlet/categories",
//           icon: (isActive) => <UserSvg isActive={isActive} />,
//         },
//       ],
//     },
//   ],
//   DRIVER: [
//     {
//       items: [
//         {
//           name: "Dashboard",
//           link: "/driver/dashboard",
//           icon: (isActive) => <DashboardSvg isActive={isActive} />,
//         },
//       ],
//     },
//   ],
// };



const navigationData: Record<UserRole, NavigationSection[]> = {
  ADMIN: [
    {
      items: [
        {
          name: "Dashboard",
          link: "/dashboard",
          icon: (isActive) => <DashboardSvg isActive={isActive} />,
        },
        {
          name: "Users",
          link: "/dashboard/users",
          icon: (isActive) => <UserSvg isActive={isActive} />,
        },
        
        {
          name: "Companies",
          link: "/dashboard/companies",
          icon: (isActive) => <CompanySvg isActive={isActive} />,
        },
        {
          name: "Settings",
          link: "/dashboard/settings",
          icon: (isActive) => <SettingsSvg isActive={isActive} />,
        },
        {
          name: "Reports",
          link: "/dashboard/reports",
          icon: (isActive) => <ReportsSvg isActive={isActive} />,
        },
        
      ],
    },
  ],
  WAREHOUSE: [
    {
      items: [
        {
          name: "Delivery",
          link: "/warehouse",
          icon: (isActive) => <DashboardSvg isActive={isActive} />,
        },
        {
          name: "Create Order",
          link: "/warehouse/create",
          icon: (isActive) => <OrderSvg isActive={isActive} />,
        },
      ],
    },
  ],
  OUTLET: [
    {
      items: [
        {
          name: "Dashboard",
          link: "/outlet/dashboard",
          icon: (isActive) => <DashboardSvg isActive={isActive} />,
        },
        {
          name: "Categories",
          link: "/outlet/categories",
          icon: (isActive) => <UserSvg isActive={isActive} />,
        },
      ],
    },
  ],
  DRIVER: [
    {
      items: [
        {
          name: "Dashboard",
          link: "/driver/dashboard",
          icon: (isActive) => <DashboardSvg isActive={isActive} />,
        },
      ],
    },
  ],
};


const Navlinks: React.FC = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const getUserType = (): UserRole => {
    const userRole = session?.user?.role as UserRole;
    if (userRole && navigationData[userRole]) {
      return userRole;
    }
    return "ADMIN";
  };

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status]);

  const userType = getUserType();
  const navigationSections = loading ? [] : navigationData[userType];

  return (
    <>
      {loading ? (
        <SidebarSkeleton />
      ) : (
        navigationSections.map(
          (section: NavigationSection, sectionIndex: number) => (
            <div key={`section-${sectionIndex}`}>
              {section.heading && (
                <h3 className="text-sm text-gray-400 mb-2 mt-4">
                  {section.heading}
                </h3>
              )}
              {section.items.map((navItem: NavigationItem) => {
                const isActive = pathname?.startsWith(navItem.link);
                return (
                  <Link
                    key={navItem.link}
                    href={navItem.link}
                    className={`grid grid-cols-[.2fr_1fr] mb-2 text-nowrap font-medium text-fontSecondary group group-hover:text-white rounded-[21px] items-center w-full px-4 hover:text-white hover:bg-primary transition-all ease-linear py-2 ${
                      isActive ? "text-white bg-primary" : ""
                    }`}
                  >
                    {navItem.icon(isActive)}
                    <span
                      className={`justify-self-start font-medium text-md group-hover:text-white ${
                        isActive ? "text-white " : ""
                      }`}
                    >
                      {navItem.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )
        )
      )}
    </>
  );
};

export default Navlinks;
