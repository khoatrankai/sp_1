/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Forbiden from "@/components/Forbiden/Forbiden";
import SchedulerWorkGantt from "@/components/ScheduleWork/SchedulerWorkGantt";
import { fetchTypeWork } from "@/redux/store/slices/activitySlices/type_work.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import { Button } from "antd";
import Link from "next/link";
import React, { useEffect } from "react";
import { LuListChecks } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const { datas: dataType } = useSelector(
    (state: RootState) => state.get_type_work
  );
  const isAuthorized = useCheckRole([
    "admin-top",
    "activity",
    "activity-read",
    "work",
    "work-read",
  ]);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (isAuthorized) dispatch(fetchTypeWork());
  }, [dispatch, isAuthorized]);
  return (
    <>
      {isAuthorized ? (
        <div className="p-8 h-full">
          <div className="flex gap-1">
            <Link href={`scheduler/${dataType?.[0]?.type_work_id}`}>
              <Button icon={<LuListChecks />} />
            </Link>
          </div>
          <SchedulerWorkGantt />
          {/* <SchedulerActivityKanban /> */}
        </div>
      ) : (
        <Forbiden />
      )}
    </>
  );
}
