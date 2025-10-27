import React from "react";
import Link from "next/link";
import Navlinks from "./Navlinks";
import { signOut, useSession } from "next-auth/react";
import Logo from "./Logo";
import { LogOut } from "lucide-react";

const roleRoutes: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  WAREHOUSE: "/warehouse",
  OUTLET: "/outlet",
  DRIVER: "/driver",
};

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const role = session?.user.role;
  // const basePath = role ? roleRoutes[role] : "/";
  const basePath = role && roleRoutes[role] ? roleRoutes[role] : "/";


  return (
    <nav className="grid gap-3 content-start relative h-screen p-3 my-auto bg-[#FAFAFA] ">
      <Link href={basePath} className="pb-2 border-b pt-5 flex flex-col gap-2">
        <Logo
          className="justify-self-start w-full h-[90px]"
          logo={"/foodland-logo.png"}
          companyName="Foodland"
        />
      
      </Link>

      <div className="overflow-auto flex flex-col h-[calc(90vh-100px)] p-2">
        <Navlinks />
        <button
          type="button"
          onClick={() => signOut()}
          className="flex gap-2 items-center cursor-pointer justify-center py-[12px] px-[14px] bg-background rounded-[20px] w-full mt-auto text-primary"
        >
          Logout <LogOut size={20} />
        </button>
        <p className="text-text text-xs mt-3 flex gap-1 justify-center mx-auto">
          Developed by <strong>Sovorun</strong>
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
