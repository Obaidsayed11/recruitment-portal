import ForgotPassword from "@/components/Auth/ForgotPassword";
import Link from "next/link";

const page = () => {
  return (
    <>
      <section className="h-screen overflow-y-auto bg-primary grid place-content-center bg-cover bg-no-repeat bg-center px-4 py-10">
        <div className="max-w-md w-full mx-auto min-h-full ">
          <ForgotPassword />
        </div>
      </section>
    </>
  );
};

export default page;
