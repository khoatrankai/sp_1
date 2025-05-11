/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import ActivityExport from "@/components/ActivityExport/ActivityExport";
import Forbiden from "@/components/Forbiden/Forbiden";
import { fetchActivities } from "@/redux/store/slices/activitySlices/activity.slice";
import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
import { fetchActivityContainers } from "@/redux/store/slices/productSlices/get_activity_container.slice";
import { fetchProductInfos } from "@/redux/store/slices/productSlices/get_products";
import { fetchSystemProfits } from "@/redux/store/slices/systemSlices/get_profit.slice";
import { fetchSystemVats } from "@/redux/store/slices/systemSlices/get_vat.slice";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";

import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}
export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "product", "product-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchProductInfos());
      dispatch(fetchActivityContainers("export"));
      dispatch(fetchCustomerInfos());
      dispatch(fetchActivities({}));
      dispatch(fetchUserInfo());
      dispatch(fetchSystemProfits());
      dispatch(fetchSystemVats());
    }
  }, [dispatch, isAuthorized]);
  return (
    <div className="p-4">
      {isAuthorized ? <ActivityExport /> : <Forbiden />}
    </div>
  );
}
