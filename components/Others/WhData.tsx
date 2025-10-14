import React from "react";
import InwardQuantity from "../Card/InwardQuantity";
import ClientL2Card from "../Card/ClientL2Card";

const WhData = () => {
  return (
    <>
      <div className="border flex flex-wrap justify-between gap-5 p-4 rounded-xl bg-secondary">
        <div className="grid pr-5 relative">
          <strong className="text-sm text-text font-medium">
            Storia Phase
          </strong>
          <span className="text-sm text-text">WH-1234</span>
        </div>

        <div className="grid relative before:absolute pl-5 before:w-[1px] before:content-[''] before:-top-2 before:-bottom-2 before:bg-gray-300">
          <strong className="text-sm text-text font-medium">
            Mumbai 4000080000000000
          </strong>
          <span className="text-sm text-text">Maharashtra</span>
        </div>

        <p className="grid relative before:absolute pl-5 before:w-[1px] before:content-[''] before:-top-2 before:-bottom-2 before:bg-gray-300 self-center text-text font-thin">
          Shop no. 12, storia Complex, worli
        </p>

        <div className="grid relative before:absolute pl-5 before:w-[1px] before:content-[''] before:-top-2 before:-bottom-2 before:bg-gray-300">
          <p className="text-text text-sm">7718012809</p>
          <p className="text-text text-sm">ayaan@ayaan.com</p>
        </div>

        <div className="grid relative before:absolute pl-5 before:w-[1px] before:content-[''] before:-top-2 before:-bottom-2 before:bg-gray-300">
          <span className="text-text text-sm">
            <strong>Created at:</strong> 12-23-2333
          </span>
          <span className="text-text text-sm">
            <strong>Updated at:</strong> 12-23-2333
          </span>
        </div>
      </div>

      <h2 className="text-base sm:text-lg mt-5 text-text">
        Delivery Performance
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] xl:grid-cols-[1fr_4fr] gap-3 md:gap-5 mb-8 my-2">
        <ClientL2Card
          label={"Deliveries"}
          number={"15"}
          className="bg-secondary rounded-xl border h-full"
          className2="bg-[#00CFA6] h-[50px] w-[50px] grid place-content-center"
          className3="text-[#00CFA6]"
        />
        <div className="grid  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 xl:gap-4 items-center px-4  py-4 xl:py-2 rounded-xl border bg-secondary">
          <h3 className="text-subtext text-base lg:text-lg sm:col-span-2 lg:col-span-3 xl:col-span-1">
            Delivery Status
          </h3>
          <InwardQuantity
            className="border-success"
            valueClassName="text-success"
            title="Completed"
            value={"300"}
          />
          <InwardQuantity
            className="border-warning"
            valueClassName="text-warning"
            title="Pending"
            value={"300"}
          />
          <InwardQuantity
            className="border-error"
            valueClassName="text-error"
            title="Failed"
            value={"300"}
          />
        </div>
      </div>
    </>
  );
};

export default WhData;
