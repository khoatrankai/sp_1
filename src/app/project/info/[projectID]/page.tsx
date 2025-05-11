/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Forbiden from "@/components/Forbiden/Forbiden";
import InfoID from "@/components/Project/InfoID/InfoID";
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
import { fetchPayments } from "@/redux/store/slices/contractSlices/payment.slide";
import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
import { fetchProjects } from "@/redux/store/slices/projectSlices/get_all_project.slice";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const { projectID } = useParams();
  const isAuthorized = useCheckRole(["admin-top", "project", "project-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchCustomerInfos());
      dispatch(fetchProjects());
      dispatch(fetchContracts({}));
      dispatch(fetchUserInfo());
      dispatch(fetchPayments({ project: projectID as string }));
    }
  }, [dispatch, isAuthorized, projectID]);
  return <div className="p-4">{isAuthorized ? <InfoID /> : <Forbiden />}</div>;
}
