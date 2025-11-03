"use client";
import { LogOut, PanelLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import ProfileIcon from "@/components/Others/ProfileModal";
import { VscBellDot } from "react-icons/vsc";
import Navlinks from "@/components/Navbar/Navlinks";
import Logo from "@/components/Navbar/Logo";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";

const roleRoutes: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  WAREHOUSE: "/warehouse/deliveries",
  OUTLET: "/outlet/dashboard",
  DRIVER: "/driver/dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { data: session } = useSession();
  const role = session?.user.role;
  const basePath = role ? roleRoutes[role] : "/";
  return (
    <>
      <div className="grid 3xl:grid-cols-[300px_5fr] h-screen bg-secondary">
        <aside className="3xl:grid sticky gap-5  border-r content-start hidden bg-white">
          <Navbar />
        </aside>
        <div className="grid w-full h-screen">
          <header className="flex px-5 items-center gap-5 justify-between w-full bg-secondary">
            <div className="flex 3xl:hidden items-center gap-5 ">
              <Sheet onOpenChange={setIsSheetOpen} open={isSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    onClick={() => setIsSheetOpen(true)}
                    className="3xl:hidden rounded-[4px] -ml-2 sm:-ml-0 mt-2 bg-primary text-white text-nowrap py-1 px-1 gap-2 text-bas font-light flex items-center justify-center transform transition-all duration-300 ease-in-out"
                  >
                    <PanelLeft className="text-2xl text-white " />
                  </button>
                </SheetTrigger>
                <SheetContent
                  onClick={() => setIsSheetOpen(false)}
                  side="left"
                  className="sm:max-w-xs p-4"
                >
                  <nav className="grid gap-2 text-lg font-medium  w-full">
                    <Link
                      href={basePath}
                      className="pb-2 border-b pt-5 flex flex-col gap-2"
                    >
                      <Logo
                        className="justify-self-start w-full h-[90px]"
                        logo={"/gridfill-log-new.png"}
                        companyName="Recruitment-Portal"
                      />
                      <p className="text-text text-center text-sm font-medium">
                        LAST MILE{" "}
                      </p>
                    </Link>
                    <div className="h-[calc(100vh-150px)] content-start  overflow-auto  pl-2">
                      <div className="w-[95%]">
                        <Navlinks />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="flex gap-2 items-center cursor-pointer justify-center py-[12px] px-[14px] bg-background rounded-[20px] w-full mt-auto text-primary"
                    >
                      Logout <LogOut size={20} />
                    </button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            <div className="ml-auto">
              <div className="absolute -top-2 sm:top-3 right-2 sm:right-5">
                <ProfileIcon />
              </div>
            </div>
          </header>
          <div className="sm:px-5 h-full bg-secondary ">{children}</div>
        </div>
      </div>
    </>
  );
}
