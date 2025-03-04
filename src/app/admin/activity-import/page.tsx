/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import ActivityImport from "@/components/ActivityImport/ActivityImport";
import Forbiden from "@/components/Forbiden/Forbiden";
import { fetchActivities } from "@/redux/store/slices/activitySlices/activity.slice";
import { fetchActivityContainers } from "@/redux/store/slices/productSlices/get_activity_container.slice";
import { fetchProductInfos } from "@/redux/store/slices/productSlices/get_products";
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
      dispatch(fetchActivityContainers("import"));
      dispatch(fetchActivities({}));
      dispatch(fetchUserInfo());
    }
  }, [dispatch, isAuthorized]);
  return (
    <div className="p-4">
      {isAuthorized ? <ActivityImport /> : <Forbiden />}
    </div>
  );
}
