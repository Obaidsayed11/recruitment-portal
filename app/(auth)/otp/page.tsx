import CopyRight from "@/components/Auth/CopyRight";
import Otp from "@/components/Auth/Otp";
import Link from "next/link";

const page = () => {
  return (
    <section className="h-screen overflow-y-auto bg-[url('/auth-page-banner.png')] grid place-content-center bg-cover bg-no-repeat bg-center px-4 py-10">
      <div className="max-w-md w-full mx-auto min-h-full ">
        <Otp />
      </div>
    </section>
  );
};

export default page;
