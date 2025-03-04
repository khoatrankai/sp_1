/* eslint-disable react-hooks/rules-of-hooks */
// import ChartColumn from "@/components/Customer/Dashboard/ChartColumn";
"use client";

import DashboardCustomer from "@/components/Customer/Dashboard/DashboardCustomer";
import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
import { fetchGroupCustomer } from "@/redux/store/slices/customerSlices/get_all_group.slice";
import { fetchSystemProvinces } from "@/redux/store/slices/systemSlices/get_province.slice";
import { AppDispatch } from "@/redux/store/store";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchCustomerInfos());
    dispatch(fetchGroupCustomer());
    dispatch(fetchSystemProvinces());
  }, [dispatch]);
  return (
    <div>
      <DashboardCustomer />
    </div>
  );
}
