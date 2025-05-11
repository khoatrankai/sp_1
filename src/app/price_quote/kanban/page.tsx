/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Forbiden from "@/components/Forbiden/Forbiden";
import Kanban from "@/components/PriceQuote/Kanban/Kanban";
import { fetchPriceQuotes } from "@/redux/store/slices/priceQuoteSlices/get_price_quotes.slice";
// import SchedulerActivityGantt from "@/components/SchedulerActivity/SchedulerActivityGantt";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole([
    "admin-top",
    "price_quote",
    "price_quote-read",
  ]);
  useEffect(() => {
    if (isAuthorized) dispatch(fetchPriceQuotes({}));
  }, [dispatch, isAuthorized]);
  return (
    <div className="sm:p-8 p-2 bg-[#001529] h-full ">
      {/* <SchedulerActivityGantt /> */}
      {isAuthorized ? <Kanban /> : <Forbiden />}
    </div>
  );
}
