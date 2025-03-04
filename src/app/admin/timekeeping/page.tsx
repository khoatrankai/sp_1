/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Forbiden from "@/components/Forbiden/Forbiden";
import TimeKeeping from "@/components/TimeKeeping/TimeKeeping";
import { checkTimekeeping } from "@/redux/store/slices/userSlices/check_timekeeping.slice";
import { fetchUserFilter } from "@/redux/store/slices/userSlices/get_filter_user.slice";
import { fetchTimekeeping } from "@/redux/store/slices/userSlices/get_timekeeping.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
// import useCheckRole from "@/utils/CheckRole";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "user", "user-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(checkTimekeeping())
      dispatch(fetchTimekeeping({}))
      dispatch(fetchUserFilter({}))
    }
  }, [dispatch, isAuthorized]);
  return (
    <div className="p-4">{isAuthorized ? <TimeKeeping /> : <Forbiden />}</div>
  );
}
