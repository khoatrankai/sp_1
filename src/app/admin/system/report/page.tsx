/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Forbiden from "@/components/Forbiden/Forbiden";
import TabReport from "@/components/Reports/TabReport";
import { fetchSystemVats } from "@/redux/store/slices/systemSlices/get_vat.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "system", "system-read"]);
  useEffect(() => {
    if (isAuthorized) dispatch(fetchSystemVats());
  }, [isAuthorized, dispatch]);
  return (
    <div className="p-4">{isAuthorized ? <TabReport /> : <Forbiden />}</div>
  );
}
