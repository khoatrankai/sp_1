/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Activity from "@/components/Detail/Project/Activity/Activity";
import { fetchActivities } from "@/redux/store/slices/activitySlices/activity.slice";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
import { AppDispatch } from "@/redux/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";




// import SaleComponent from "@/components/SaleComponent/SaleComponent";

export default function page() {
  
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
   dispatch(fetchActivities({}))
   dispatch(fetchUserInfo())
  }, [dispatch]);
  return (
    <>
      {/* <SaleComponent /> */}
      <Activity />
      
    </>
  );
}
