/* eslint-disable react-hooks/rules-of-hooks */
// import ChartColumn from "@/components/Customer/Dashboard/ChartColumn";
"use client";

import Forbiden from "@/components/Forbiden/Forbiden";
import DashboardOpportunities from "@/components/Opportunity/Dashboard/DashboardOpportunities";
import { fetchOpportunitiesHaveContract } from "@/redux/store/slices/opportunitySlices/get_opportunity_contract.slice";
import { fetchOpportunitiesHavePriceQuote } from "@/redux/store/slices/opportunitySlices/get_opportunity_price_quote.slice";
import { fetchSourcesOpportunity } from "@/redux/store/slices/opportunitySlices/get_source.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole([
    "admin-top",
    "opportunity",
    "opportunity-read",
  ]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchSourcesOpportunity())
      dispatch(fetchOpportunitiesHavePriceQuote())
      dispatch(fetchOpportunitiesHaveContract())
    }
  }, [dispatch, isAuthorized]);
  return <div>{isAuthorized ? <DashboardOpportunities /> : <Forbiden />}</div>;
}
