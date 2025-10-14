import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

interface BreadcrumbDropdownItem {
  label: string;
  href: string;
}

interface BreadcrumbLink {
  label: string;
  href?: string; // If `href` is undefined, it's treated as the current page.
  dropdownItems?: BreadcrumbDropdownItem[]; // For dropdown menus
}

interface DynamicBreadcrumbProps {
  links: BreadcrumbLink[];
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({ links }) => {
  // Function to render a single breadcrumb item
  const renderBreadcrumbItem = (
    link: BreadcrumbLink,
    index: number,
    visibilityClasses: string = ""
  ) => {
    const isCurrentPage = index === links.length - 1;

    return (
      <BreadcrumbItem
        className={`px-3 sm:px-0 items-center ${visibilityClasses}`}
      >
        {link.dropdownItems ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center text-base gap-1 ${
                isCurrentPage
                  ? "text-fontPrimary font-medium"
                  : "text-gray-400 font-medium"
              }`}
            >
              <span>{link.label}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {link.dropdownItems.map((item, i) => (
                <DropdownMenuItem key={i}>
                  <Link className="text-base" href={item.href}>
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : link.href ? (
          <Link
            className={`text-base ${
              isCurrentPage
                ? "text-fontPrimary font-medium"
                : "text-gray-400 font-medium"
            }`}
            href={link.href}
          >
            {link.label}
          </Link>
        ) : (
          <BreadcrumbPage
            className={`text-base ${
              isCurrentPage
                ? "text-fontPrimary font-medium"
                : "text-gray-400 font-medium"
            }`}
          >
            {link.label}
          </BreadcrumbPage>
        )}
      </BreadcrumbItem>
    );
  };

  return (
    <Breadcrumb className="py-2 2xl:py-6">
      <BreadcrumbList className="2xl:ml-0 ml-0">
        {links.length <= 1 ? (
          // If we have only 1 link, just display it
          renderBreadcrumbItem(links[0], 0)
        ) : (
          <>
            {/* First breadcrumb item (visible on md+ and sm+, hidden on xs) */}
            {renderBreadcrumbItem(links[0], 0, "hidden sm:flex")}

            {/* First separator (visible only on md+ and sm+) */}
            {links.length > 1 && (
              <BreadcrumbSeparator className="hidden sm:flex" />
            )}

            {/* Middle items (visible only on md+) */}
            {links.slice(1, -1).map((link, idx) => (
              <React.Fragment key={idx + 1}>
                {renderBreadcrumbItem(link, idx + 1, "hidden md:flex")}
                {/* Add separator after each middle item */}
                <BreadcrumbSeparator className="hidden md:flex" />
              </React.Fragment>
            ))}

            {/* Mobile ellipsis dropdown for sm breakpoint (shows everything except first and last) */}
            {links.length > 2 && (
              <BreadcrumbItem className="hidden sm:flex md:hidden items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-gray-400">
                    <MoreHorizontal size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    {links.slice(1, -1).map((link, idx) => (
                      <DropdownMenuItem key={idx}>
                        {link.href ? (
                          <Link href={link.href}>{link.label}</Link>
                        ) : (
                          <span>{link.label}</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            )}

            {/* Separator before last item (visible on sm+ only when there's an ellipsis) */}
            {links.length > 2 && (
              <BreadcrumbSeparator className="hidden sm:flex md:hidden" />
            )}

            {/* XS breakpoint dropdown (shows everything except last) */}
            <BreadcrumbItem className="sm:hidden flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-400">
                  <MoreHorizontal size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {links.slice(0, -1).map((link, idx) => (
                    <DropdownMenuItem key={idx}>
                      {link.href ? (
                        <Link href={link.href}>{link.label}</Link>
                      ) : (
                        <span>{link.label}</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            {/* Separator before last item (visible on xs only) */}
            <BreadcrumbSeparator className="sm:hidden flex" />

            {/* Last breadcrumb item (always visible) */}
            {renderBreadcrumbItem(
              links[links.length - 1],
              links.length - 1,
              "flex"
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
