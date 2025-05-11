/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import InfoID from "@/components/Customer/InfoID/InfoID";
import { fetchGroupCustomer } from "@/redux/store/slices/customerSlices/get_all_group.slice";
import { fetchCustomerFilter } from "@/redux/store/slices/customerSlices/get_filter_customer.slice";
import { fetchSystemProvinces } from "@/redux/store/slices/systemSlices/get_province.slice";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataRoleAccess } = useSelector(
    (state: RootState) => state.get_access_roles
  );
  useEffect(() => {
    if (
      dataRoleAccess?.find(
        (dt) =>
          dt.role_type.name_tag === "customer" ||
          dt.role_type.name_tag === "admin-top"
      )
    ) {
      dispatch(fetchCustomerFilter({}));
      dispatch(fetchGroupCustomer());
      dispatch(fetchUserInfo());
      dispatch(fetchSystemProvinces());
    }
  }, [dispatch, dataRoleAccess]);
  return (
    <div className="p-4">
      <InfoID />
    </div>
  );
}
