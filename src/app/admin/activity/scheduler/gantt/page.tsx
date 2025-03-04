/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Forbiden from "@/components/Forbiden/Forbiden";
import { fetchActivities } from "@/redux/store/slices/activitySlices/activity.slice";
import { fetchStatusActivities } from "@/redux/store/slices/activitySlices/status_activity.slice";
import { fetchStatusWork } from "@/redux/store/slices/activitySlices/status_work.slice";
import { fetchTypeActivities } from "@/redux/store/slices/activitySlices/type_activity.slice";
import { fetchTypeWork } from "@/redux/store/slices/activitySlices/type_work.slice";
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
// const Gantt = dynamic(() => import("@/components/Activity/Gantt/Gantt"));
const Gantt2 = dynamic(() => import("@/components/Activity/Gantt/Gantt2"));
// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "activity", "activity-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchActivities({}));
      dispatch(fetchContracts(null));
      dispatch(fetchUserInfo());
      dispatch(fetchTypeWork());
      dispatch(fetchStatusWork());
      dispatch(fetchTypeActivities());
      dispatch(fetchStatusActivities());
    }
  }, [dispatch, isAuthorized]);
  return (
    <>
      {isAuthorized ? (
        <div className="h-full translate-y-0 relative">
          <p className="px-4 pt-2 font-semibold text-base text-[#1AA59D] z-50 absolute top-0 left-0">
            Tổng quan hoạt động
          </p>
          <Gantt2 />
        </div>
      ) : (
        <Forbiden />
      )}
    </>
  );
}
