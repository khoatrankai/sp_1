/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import List from "@/components/Detail/Project/List/List";
import { fetchProjects } from "@/redux/store/slices/projectSlices/get_all_project.slice";
import { fetchProjectTypeFulls } from "@/redux/store/slices/projectSlices/get_full_type.slice";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
import { AppDispatch } from "@/redux/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


// import SaleComponent from "@/components/SaleComponent/SaleComponent";

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(()=>{
    dispatch(fetchProjects())
    dispatch(fetchUserInfo())
    dispatch(fetchProjectTypeFulls())
  },[])
  return (
    <>
      {/* <SaleComponent /> */}
      <List />
    </>
  );
}
