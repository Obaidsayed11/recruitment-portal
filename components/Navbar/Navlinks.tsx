// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useSession } from "next-auth/react";
// import DashboardSvg from "../Svgs/DashboardSvg";
// import Skeleton3 from "../Others/Skeleton3";
// import SettingSvg from "../Svgs/SettingSvg";
// import UserSvg from "../Svgs/UserSvg";
// import { usePermissions } from "../PermissionContext";
// import CompanySvg from "../Svgs/CompanySvg";
// import { hasPermission } from "@/lib/hasPermission";

// interface NavigationItem {
//   name: string;
//   link: string;
//   icon: (isActive: any) => React.ReactNode;
//   permission?: string;  
// }

// interface NavigationSection {
//   heading?: string; // Made optional as some sections might not have a heading
//   items: NavigationItem[];
// }

// const Navlinks: React.FC = () => {
//   const { data: session, status } = useSession();
//   const pathname = usePathname();
//   const [loading, setLoading] = useState(true);
//   const { permissions, data } = usePermissions();

//   const navigationData: NavigationSection[] = [
//     {
//       items: [
//         {
//           name: "Dashboard",
//           link: "/dashboard",
//           icon: (isActive) => <DashboardSvg isActive={isActive} />,
//         },
//         {
//           name: "Companies",
//           link: "/companies",
//           permission: "list_companies",
//           icon: (isActive) => <CompanySvg isActive={isActive} />,
//         },
//         {
//           name: "Users",
//           link: "/users",
//           permission: "list_users",
//           icon: (isActive) => <UserSvg isActive={isActive} />,
//         },
//         ...(session?.user.role === "SYSTEM"
//           ? [
//               {
//                 name: "Settings",
//                 link:'/settings',
//                 icon: (isActive: any) => <SettingSvg isActive={isActive} />,
//               },
//             ]
//           : []),
//       ],
//     },
//   ];

//   useEffect(() => {
//     if (status === "loading") {
//       setLoading(true);
//     } else {
//       setLoading(false);
//     }
//   }, [status]);

//   return (
//     <>
//       {loading ? (
//         <>
//           <Skeleton3 />
//         </>
//       ) : (
//         navigationData.map(
//           (section: NavigationSection, sectionIndex: number) => {
//             // Filter items based on permissions
//             const visibleItems = section.items.filter(
//               (navItem: NavigationItem) => {
//                 return (
//                   !navItem.permission ||
//                   hasPermission(permissions, navItem.permission)
//                 );
//               }
//             );

//             // Only render section if it has visible items
//             if (visibleItems.length === 0) {
//               return null;
//             }

//             return (
//               <div key={`section-${sectionIndex}`}>
//                 {visibleItems.map((navItem: NavigationItem) => {
//                   const isActive = pathname?.startsWith(navItem.link);
//                   return (
//                     <Link
//                       key={navItem.link}
//                       href={navItem.link}
//                       className={`grid grid-cols-[.2fr_1fr] mb-2 text-nowrap font-medium text-fontSecondary group group-hover:text-white rounded-[21px] items-center w-full px-4 hover:text-white hover:bg-primary transition-all ease-linear py-2 ${
//                         isActive ? "text-white bg-primary" : ""
//                       }`}
//                     >
//                       {navItem.icon(isActive)}
//                       <span
//                         className={`justify-self-start font-medium text-md group-hover:text-white ${
//                           isActive ? "text-white " : ""
//                         }`}
//                       >
//                         {navItem.name}
//                       </span>
//                     </Link>
//                   );
//                 })}
//               </div>
//             );
//           }
//         )
//       )}
//     </>
//   );
// };

// export default Navlinks;


"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardSvg from "../Svgs/DashboardSvg";
import Skeleton3 from "../Others/Skeleton3";
import SettingSvg from "../Svgs/SettingSvg";
import UserSvg from "../Svgs/UserSvg";
import { usePermissions } from "../PermissionContext";
import CompanySvg from "../Svgs/CompanySvg";
import { hasPermission } from "@/lib/hasPermission";

interface NavigationItem {
  name: string;
  link: string;
  icon: (isActive: any) => React.ReactNode;
  permission?: string;
}

interface NavigationSection {
  heading?: string;
  items: NavigationItem[];
}

const Navlinks: React.FC = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const { permissions } = usePermissions();

  const navigationData: NavigationSection[] = [
    {
      items: [
        {
          name: "Dashboard",
          link: "/dashboard",
          icon: (isActive) => <DashboardSvg isActive={isActive} />,
        },
        {
          name: "Companies",
          link: "/companies",
          permission: "list_companies",
          icon: (isActive) => <CompanySvg isActive={isActive} />,
        },
        {
          name: "Users",
          link: "/users",
          permission: "list_users",
          icon: (isActive) => <UserSvg isActive={isActive} />,
        },
        ...(session?.user?.role === "SYSTEM"
          ? [
              {
                name: "Settings",
                link: "/settings",
                icon: (isActive: any) => <SettingSvg isActive={isActive} />,
              },
            ]
          : []),
      ],
    },
  ];

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status]);

  return (
    <>
      {loading ? (
        <Skeleton3 />
      ) : (
        navigationData.map(
          (section: NavigationSection, sectionIndex: number) => {
            // Filter items based on permissions
            const visibleItems = section.items.filter(
              (navItem: NavigationItem) => {
                return (
                  !navItem.permission ||
                  hasPermission(permissions, navItem.permission)
                );
              }
            );

            // Only render section if it has visible items
            if (visibleItems.length === 0) {
              return null;
            }

            return (
              <div key={`section-${sectionIndex}`}>
                {visibleItems.map((navItem: NavigationItem) => {
                  // Ensure link is always defined
                  const linkHref = navItem.link || "/dashboard";
                  const isActive = pathname?.startsWith(linkHref);
                  
                  return (
                    <Link
                      key={navItem.name}
                      href={linkHref}
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
            );
          }
        )
      )}
    </>
  );
};

export default Navlinks;
