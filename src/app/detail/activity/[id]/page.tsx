/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Activity from "@/components/Detail/Project/Activity/Activity";
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
import { AppDispatch } from "@/redux/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";




// import SaleComponent from "@/components/SaleComponent/SaleComponent";

export default function page() {
  
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
   dispatch(fetchContracts({}))
  }, [dispatch]);
  return (
    <>
      {/* <SaleComponent /> */}
      <Activity />
      
    </>
  );
}
