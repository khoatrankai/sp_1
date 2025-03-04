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
import { AppDispatch, RootState } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// const Gantt = dynamic(() => import("@/components/Activity/Gantt/Gantt"));
const GanttID = dynamic(
  () => import("@/components/Activity/Gantt/GanttID/GanttID")
);
// type Props = {}

export default function page() {
  const { id } = useParams();
  const { datas: dataContract } = useSelector(
    (state: RootState) => state.get_contracts
  );
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "activity", "activity-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchContracts(null));
      dispatch(fetchUserInfo());
      dispatch(fetchTypeWork());
      dispatch(fetchActivities({}));
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
            {dataContract.find((dt) => dt.contract_id === id)?.name_contract}
          </p>
          <GanttID ID={id as string} />
        </div>
      ) : (
        <Forbiden />
      )}
    </>
  );
}
