/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Customer from "@/components/Customer/Customer";
import Forbiden from "@/components/Forbiden/Forbiden";
import { fetchCustomerAbout } from "@/redux/store/slices/customerSlices/about_customer.slice";
import { fetchGroupCustomer } from "@/redux/store/slices/customerSlices/get_all_group.slice";
import { fetchCustomerFilter } from "@/redux/store/slices/customerSlices/get_filter_customer.slice";
import { fetchSystemProvinces } from "@/redux/store/slices/systemSlices/get_province.slice";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "customer", "customer-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchCustomerFilter({}));
      dispatch(fetchCustomerAbout());
      dispatch(fetchUserInfo());
      dispatch(fetchSystemProvinces());
      dispatch(fetchGroupCustomer());
    }
  }, [dispatch, isAuthorized]);
  return (
    <div className="p-4">{isAuthorized ? <Customer /> : <Forbiden />}</div>
  );
}
