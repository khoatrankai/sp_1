/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Contract from "@/components/Detail/Project/Contract/Contract";
import { fetchTypeActivities } from "@/redux/store/slices/activitySlices/type_activity.slice";
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
import { AppDispatch } from "@/redux/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";



// import SaleComponent from "@/components/SaleComponent/SaleComponent";

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
   dispatch(fetchTypeActivities())
   dispatch(fetchContracts({}))
  }, [dispatch]);
  return (
    <>
      {/* <SaleComponent /> */}
      <Contract />
    </>
  );
}
