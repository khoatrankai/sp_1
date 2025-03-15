/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Contract from "@/components/Detail/Project/Contract/Contract";
import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
import { AppDispatch } from "@/redux/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";



// import SaleComponent from "@/components/SaleComponent/SaleComponent";

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
   dispatch(fetchCustomerInfos())
  }, [dispatch]);
  return (
    <>
      {/* <SaleComponent /> */}
      <Contract />
    </>
  );
}
