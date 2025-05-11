/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Forbiden from "@/components/Forbiden/Forbiden";
import LinkSystem from "@/components/LinkSystem/LinkSystem";
import { fetchLinkSystem } from "@/redux/store/slices/systemSlices/get_linksystem.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "system", "system-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchLinkSystem());
    }
  }, [dispatch, isAuthorized]);
  return (
    <div className="p-4">{isAuthorized ? <LinkSystem /> : <Forbiden />}</div>
  );
}
