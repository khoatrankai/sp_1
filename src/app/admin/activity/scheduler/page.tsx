/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Forbiden from "@/components/Forbiden/Forbiden";
import SchedulerActivityGantt from "@/components/SchedulerActivity/SchedulerActivityGantt";
import { fetchTypeActivities } from "@/redux/store/slices/activitySlices/type_activity.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import { Button } from "antd";
import Link from "next/link";
import React, { useEffect } from "react";
import { FaChartGantt } from "react-icons/fa6";
import { LuListChecks } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const { datas: dataType } = useSelector(
    (state: RootState) => state.get_type_activities
  );
  const isAuthorized = useCheckRole(["admin-top", "activity", "activity-read"]);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (isAuthorized) dispatch(fetchTypeActivities());
  }, [dispatch, isAuthorized]);
  return (
    <>
      {isAuthorized ? (
        <div className="p-8 h-full">
          <div className="flex gap-1">
            <Link href={"scheduler/gantt"}>
              <Button icon={<FaChartGantt />} />
            </Link>
            <Link href={`scheduler/${dataType?.[0]?.type_activity_id}`}>
              <Button icon={<LuListChecks />} />
            </Link>
          </div>
          <SchedulerActivityGantt />
          {/* <SchedulerActivityKanban /> */}
        </div>
      ) : (
        <Forbiden />
      )}
    </>
  );
}
