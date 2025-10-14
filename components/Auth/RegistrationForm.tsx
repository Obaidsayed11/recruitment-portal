"use client";
import React, { useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import InputField from "../Form_Fields/InputField";
import Link from "next/link";
import Button from "../Others/Button";
import { log } from "@/utils/logger";
import { Eye, EyeClosed } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useStepNavigator } from "@/hooks/useStepNavigator";
import TagInput from "../Others/TagInput";

const dummyIndustries = ["Metal", "Oil & Gas", ""];
const dummySkills = ["Plastic", "Steel", "AutoCAD"];

const RegistrationForm = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const { navigateToStep } = useStepNavigator();
  const methods = useForm();
  const pathName = usePathname();
  const { handleSubmit, watch, setValue } = methods;
  const consent = watch("consent");

  const viewPasswordHandler = () => {
    setViewPassword((prev) => !prev);
  };

  const onSubmit = (data: any) => {
    log(data);
    navigateToStep(1, "welcome");
  };

  return (
    <FormProvider {...methods}>
      <form
        className="grid xl:grid-cols-2 w-full gap-x-5 gap-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField
          name={pathName?.includes("/company") ? "companyName" : "fName"}
          label={
            pathName?.includes("/company") ? "Comapny name*" : "First Name*"
          }
          placeholder={
            pathName?.includes("/company")
              ? "Enter company name"
              : "Enter first name"
          }
        />
        <InputField
          name={pathName?.includes("/company") ? "contactName" : "lName"}
          label={
            pathName?.includes("/company") ? "Contact person*" : "Last Name*"
          }
          placeholder={
            pathName?.includes("/company")
              ? "Enter person name"
              : "Enter surname"
          }
        />
        <InputField
          name={"email"}
          label={"Email"}
          placeholder={"Enter your email"}
        />
        <InputField
          name={"phone"}
          label={"Phone"}
          placeholder={"Enter your phone number"}
        />

        <TagInput
          title={pathName?.includes("/company") ? "Industries" : "Your skills"}
          suggestedData={
            pathName?.includes("/company") ? dummySkills : dummyIndustries
          }
          suggestedTitle={
            pathName?.includes("/company")
              ? "Suggested industries"
              : "Suggested skills"
          }
          className={"xl:col-span-2"}
        />

        <div className="relative xl:col-span-2">
          <InputField
            name={"password"}
            type={viewPassword ? "text" : "password"}
            label={"Create Password"}
            placeholder={"Enter strong password"}
          />

          {viewPassword ? (
            <Eye
              onClick={viewPasswordHandler}
              className={`stroke-1 cursor-pointer text-secondary-foreground/40 text-2xl font-normal absolute right-3 ${
                methods.formState.errors.password
                  ? "bottom-[9px]"
                  : "bottom-[9px]"
              }`}
            />
          ) : (
            <EyeClosed
              onClick={viewPasswordHandler}
              className={`stroke-1 cursor-pointer text-secondary-foreground/40 text-xl absolute right-3 ${
                methods.formState.errors.password
                  ? "bottom-[7px]"
                  : "bottom-[9px]"
              }`}
            />
          )}
        </div>

        <p className="text-warning text-sm font-medium xl:col-span-2">
          Use 8+ characters with a mix of letters, numbers & symbols.
        </p>

        <hr className="xl:col-span-2 w-full h-[2px] my-2 border-border" />

        <div className="xl:col-span-2 flex justify-center gap-3">
          <input
            type="checkbox"
            checked={consent || false}
            onChange={() => setValue("consent", !consent)}
            className="accent-primary border-2 rounded-md h-4 w-4 my-auto"
            id="consent"
          />

          <label htmlFor="consent" className="space-x-1 text-sm my-2">
            I agree to{" "}
            <Link
              className="text-link font-medium underline"
              href={"/terms-and-conditions"}
            >
              Terms & Conditions
            </Link>
            and{" "}
            <Link
              className="text-link ml-1 font-medium underline"
              href={"/general-nda"}
            >
              General NDA
            </Link>
          </label>
        </div>

        <Button
          disabled={!consent === true}
          type="submit"
          className="xl:col-span-2 w-full rounded-md"
        >
          Register
        </Button>
      </form>
    </FormProvider>
  );
};

export default RegistrationForm;
