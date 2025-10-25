import React, { useEffect, useState } from "react";
import InwardQuantity from "../Card/InwardQuantity";
import ClientL2Card from "../Card/ClientL2Card";
import apiClient from "@/lib/axiosInterceptor";
import { LocationProps, WarehouseProps } from "@/types/interface";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const SingleWarehouseDetails = () => {
  const { data: session } = useSession();
  const params = useParams<{ slug: any }>();

  // const [warehouseData, setWarehouseData] = useState<WarehouseProps>();
  const [warehouseData, setWarehouseData] = useState<LocationProps | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [deliveryStats, setDeliveryStats] = useState<any | null>(null);

  useEffect(() => {
    if (session && params?.slug) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await apiClient.get(`/locations/${params?.slug}`);
          setWarehouseData(response.data.location || []);
          setDeliveryStats(response.data.deliveryStats || []);
        } catch (error: any) {
          console.error(error.response.data.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [params?.slug, session]);

  if (loading)
    <p className="text-text font-medium grid justify-center items-center">
      Loading...
    </p>;

  return (
    <>
      <div className="border items-center flex flex-wrap justify-between gap-5 p-4 rounded-xl bg-secondary">
        <div className="grid pr-5 gap-1 relative max-w-[200px]">
          <strong className="text-base text-text font-medium">
            {warehouseData?.name || "NA"}
          </strong>
          <span className="text-xs text-subtext text-wrap  break-all">
            <strong className="font-medium text-text">Code: </strong>
            {(warehouseData?.code && warehouseData?.code) || "NA"}
          </span>
        </div>

        <div className="grid gap-1 items-center relative before:absolute pl-5 before:w-[1px] before:content-[''] before:-top-2 before:-bottom-2 before:bg-gray-300">
          <span className="text-xs text-subtext max-w-[550px] ">
            <span className="mr-2 font-medium text-text text-base">
              Address:{" "}
            </span>
            {(warehouseData?.address && warehouseData?.address) || "NA"}
          </span>
        </div>
        <div className="grid relative before:absolute pl-5  before:w-[1px] before:content-[''] text-subtext text-sm gap-1 before:-top-2 before:-bottom-2 before:bg-gray-300">
          <span className="text-subtext">
            State: {warehouseData?.Pincode?.State?.name}
          </span>
          <span className="text-subtext">
            City: {warehouseData?.Pincode?.City?.name}
          </span>
          <span className="text-subtext">
            Pincode: {warehouseData?.Pincode?.code}
          </span>
        </div>

        <div className="grid relative before:absolute pl-5 before:w-[1px] before:content-[''] before:-top-2 before:-bottom-2 before:bg-gray-300">
          <span className="text-subtext text-sm">
            <strong className="text-text font-medium mr-1">Created at:</strong>{" "}
            {(warehouseData?.createdAt &&
              warehouseData?.createdAt.split("T")[0]) ||
              "NA"}
          </span>
          <span className="text-subtext text-sm">
            <strong className="text-text mr-1 font-medium">Updated at:</strong>{" "}
            {(warehouseData?.updatedAt &&
              warehouseData?.updatedAt.split("T")[0]) ||
              "NA"}
          </span>
        </div>
      </div>

      {/* <h2 className="text-base sm:text-lg mt-5 text-text">
        Delivery Performance
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] xl:grid-cols-[1fr_4fr] gap-3 md:gap-5 mb-8 my-2">
        <ClientL2Card
          label={"Deliveries"}
          number={deliveryStats?.TOTAL?.toString() || "0"}
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
            title="Delivered"
            value={deliveryStats?.DELIVERED || 0}
          />
          <InwardQuantity
            className="border-warning"
            valueClassName="text-warning"
            title="Pending"
            value={deliveryStats?.PENDING || 0}
          />
          <InwardQuantity
            className="border-error"
            valueClassName="text-error"
            title="Failed"
            value={deliveryStats?.FAILED || 0}
          />
        </div>
      </div> */}
    </>
  );
};

export default SingleWarehouseDetails;