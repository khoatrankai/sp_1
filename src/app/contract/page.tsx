/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Contract from "@/components/Contract/Contract";
import Forbiden from "@/components/Forbiden/Forbiden";
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
import { fetchContractAbout } from "@/redux/store/slices/contractSlices/get_about.slice";
import { fetchTypeContracts } from "@/redux/store/slices/contractSlices/type_contract.slide";
import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
import { fetchProjects } from "@/redux/store/slices/projectSlices/get_all_project.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "contract", "contract-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchProjects());
      dispatch(fetchCustomerInfos());
      dispatch(fetchContracts(null));
      dispatch(fetchTypeContracts());
      dispatch(fetchContractAbout());
    }
  }, [dispatch, isAuthorized]);
  return (
    <div className="p-4">{isAuthorized ? <Contract /> : <Forbiden />}</div>
  );
}
