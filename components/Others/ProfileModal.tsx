"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/axiosInterceptor";
import { AdminProfileData } from "@/types/interface";
import { BACKEND_URL, BASE_URL } from "@/config";
import AdminProfileModal from "./AdminProfileModal";

export const ProfileIcon: React.FC = () => {
  const [userData, setUserData] = useState<AdminProfileData>();
  const { data: session } = useSession();

  const fetchUserData = useCallback(async () => {
    try {
      const role = session?.user.role.toLowerCase();
      const url = `/auth/profile`;
      const response = await apiClient.get(url);
      setUserData(response.data);
    } catch (error: any) {
      console.error(error.response.message);
    }
  }, [session]); // Dependency on session to ensure it's updated

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session, fetchUserData]);

  if (!userData) {
    return (
      <div className="flex relative cursor-pointer border px-2 items-center select-none gap-2 py-2 rounded-xl bg-white transition-all ease-linear my-2">
        <span className="rounded-full object-cover border gap-5 w-[35px] h-[35px] bg-gray-200 animate-pulse" />
        <div className="grid gap-1">
          <span className="grid content-center h-4 w-[120px] rounded-full bg-gray-200 animate-pulse my-auto"></span>
          <span className="grid content-center h-3 w-[80px] rounded-full bg-gray-200 animate-pulse my-auto"></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex relative cursor-pointer border px-2 bg-white items-center select-none gap-2 py-2 rounded-md transition-all ease-linear my-2">
        {userData.user.photo ? (
          <Image
            className="rounded-full object-cover border bg-secondary w-[35px] h-[35px]"
            height={50}
            width={50}
            alt={userData.user.fullName}
            src={`${BASE_URL}${userData.user.photo || "/"}`}
          />
        ) : (
          <div className="w-[35px] h-[35px] rounded-full bg-gray-400 flex items-center overflow-hidden justify-center text-white font-bold text-lg">
            {userData.user.fullName?.charAt(0).toUpperCase() || "NA"}
          </div>
        )}
        <div className="grid content-center my-auto">
          <h2 className="leading-4 text-fontPrimary font-medium">
            {(userData.user.fullName &&
              userData.user.fullName.split(" ").slice(0, 2).join(" ")) ||
              "User"}
          </h2>
          <span className="text-xs text-fontSecondary">
            {userData.user.role
              ? userData.user.role.charAt(0).toUpperCase() +
                userData.user.role.slice(1).toLowerCase()
              : ""}
          </span>
        </div>
        <AdminProfileModal userData={userData} refreshData={fetchUserData} />
      </div>
    </>
  );
};

export default ProfileIcon;
