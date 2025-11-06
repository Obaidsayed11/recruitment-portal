import LoginForm, { ActionType } from "@/components/Auth/LoginForm";

const SigninRoute = () => {
  return (
    // <section className="h-screen overflow-y-auto bg-[url('/auth-page-banner.png')] grid place-content-center bg-cover bg-no-repeat bg-center px-4 py-10">
     <section className="h-screen overflow-y-auto bg-primary grid place-content-center bg-cover bg-no-repeat bg-center px-4 py-10">
      <div className="max-w-md w-full mx-auto min-h-full ">
        <LoginForm />
      </div>
    </section>
  );
};

export default SigninRoute;
