/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Forbiden from "@/components/Forbiden/Forbiden";
// import SchedulerActivityGantt from "@/components/SchedulerActivity/SchedulerActivityGantt";
import SchedulerActivityKanban from "@/components/SchedulerActivity/SchedulerActivityKanban";
import { fetchTypeActivities } from "@/redux/store/slices/activitySlices/type_activity.slice";
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "activity", "activity-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchTypeActivities());
      dispatch(fetchContracts(null));
    }
  }, [dispatch, isAuthorized]);
  return (
    <>
      {isAuthorized ? (
        <div className="sm:p-8 p-2 bg-[#001529] h-full">
          {/* <SchedulerActivityGantt /> */}
          <SchedulerActivityKanban />
        </div>
      ) : (
        <Forbiden />
      )}
    </>
  );
}
