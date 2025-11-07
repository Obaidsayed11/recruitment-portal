import React from "react";
import Link from "next/link";
import Navlinks from "./Navlinks";
import { signOut, useSession } from "next-auth/react";
import Logo from "./Logo";
import { LogOut } from "lucide-react";

const roleRoutes: Record<string, string> = {
  SYSTEM: "/dashboard",
};

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const role = session?.user.role;
  const basePath = roleRoutes[role as keyof typeof roleRoutes] || "/dashboard";

  return (
    <nav className="grid gap-3 content-start relative h-screen p-3 my-auto bg-[#FAFAFA]">
      <Link href={basePath} className="pb-2 border-b pt-5 flex flex-col gap-2">
        <Logo
          className="justify-self-start w-full h-[60px]"
          logo={"/lanjekar-holding-logo.png"}
          companyName="Recruitement-Portal"
        />
      </Link>

      {/* Main Content Area with Flex Layout */}
      <div className="flex flex-col h-[calc(100vh-140px)] overflow-hidden">
        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <Navlinks />
        </div>

        {/* Fixed Bottom Section - Logout & Credits */}
        <div className="flex-shrink-0 p-2 pt-3 border-t border-gray-200 bg-[#FAFAFA]">
          <button
            type="button"
            onClick={() => signOut()}
            className="flex gap-2 items-center cursor-pointer justify-center py-3 px-3.5 bg-background rounded-[20px] w-full text-primary hover:bg-gray-100 transition-colors"
          >
            Logout <LogOut size={20} />
          </button>
          
          <p className="text-text text-xs mt-3 flex gap-1 justify-center mx-auto">
            Developed by <strong>Sovorun</strong>
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;