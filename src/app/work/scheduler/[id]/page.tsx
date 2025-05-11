/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Forbiden from "@/components/Forbiden/Forbiden";
import SchedulerWorkKanban from "@/components/ScheduleWork/SchedulerWorkKanban";
import { fetchTypeWork } from "@/redux/store/slices/activitySlices/type_work.slice";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
// import SchedulerActivityGantt from "@/components/SchedulerActivity/SchedulerActivityGantt";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole([
    "admin-top",
    "activity",
    "activity-read",
    "work",
    "work-read",
  ]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchTypeWork());
      dispatch(fetchUserInfo());
    }
  }, [dispatch, isAuthorized]);
  return (
    <>
      {isAuthorized ? (
        <div className="sm:p-8 p-2 bg-[#001529] h-full">
          {/* <SchedulerActivityGantt /> */}
          <SchedulerWorkKanban />
        </div>
      ) : (
        <Forbiden />
      )}
    </>
  );
}
