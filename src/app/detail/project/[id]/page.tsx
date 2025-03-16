/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Project from "@/components/Detail/Project/Project/Project";
import { fetchTypeContracts } from "@/redux/store/slices/contractSlices/type_contract.slide";
import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
import { fetchProjects } from "@/redux/store/slices/projectSlices/get_all_project.slice";
import { AppDispatch } from "@/redux/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";



// import SaleComponent from "@/components/SaleComponent/SaleComponent";

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
   dispatch(fetchCustomerInfos())
   dispatch(fetchProjects())
   dispatch(fetchTypeContracts())
  }, [dispatch]);
  return (
    <>
      {/* <SaleComponent /> */}
      <Project />
    </>
  );
}
