/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Forbiden from "@/components/Forbiden/Forbiden";
import Project from "@/components/Project/Project";
import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
import { fetchOpportunities } from "@/redux/store/slices/opportunitySlices/get_opportunities.slice";
import { fetchProjectAbout } from "@/redux/store/slices/projectSlices/get_about.slice";
import { fetchProjects } from "@/redux/store/slices/projectSlices/get_all_project.slice";
import { fetchProjectTypes } from "@/redux/store/slices/projectSlices/get_type.slice";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "project", "project-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchProjects());
      dispatch(fetchCustomerInfos());
      dispatch(fetchUserInfo());
      dispatch(fetchOpportunities({}));
      dispatch(fetchProjectTypes());
      dispatch(fetchProjectAbout());
    }
  }, [dispatch, isAuthorized]);
  return <div className="p-4">{isAuthorized ? <Project /> : <Forbiden />}</div>;
}
