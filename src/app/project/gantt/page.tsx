/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Forbiden from "@/components/Forbiden/Forbiden";
import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
import { fetchProjectTypeFulls } from "@/redux/store/slices/projectSlices/get_full_type.slice";
import { fetchProjectTypes } from "@/redux/store/slices/projectSlices/get_type.slice";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
// const Gantt = dynamic(() => import("@/components/Activity/Gantt/Gantt"));
const Gantt = dynamic(() => import("@/components/Project/Gantt/Gantt"));
// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "project", "project-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchProjectTypeFulls());
      dispatch(fetchUserInfo());
      dispatch(fetchProjectTypes());
      dispatch(fetchCustomerInfos());
    }
  }, [dispatch, isAuthorized]);
  return (
    <>
      {isAuthorized ? (
        <div className="h-full translate-y-0 relative">
          <p className="px-4 pt-2 font-semibold text-base text-[#1AA59D] z-50 absolute top-0 left-0">
            Tổng quan dự án
          </p>
          <Gantt />
        </div>
      ) : (
        <Forbiden />
      )}
    </>
  );
}
