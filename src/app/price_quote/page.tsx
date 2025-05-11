/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Forbiden from "@/components/Forbiden/Forbiden";
import PriceQuote from "@/components/PriceQuote/PriceQuote";
// import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
import { fetchPriceQuotes } from "@/redux/store/slices/priceQuoteSlices/get_price_quotes.slice";
import { fetchTypePackage } from "@/redux/store/slices/priceQuoteSlices/get_type_package.slice";
import { fetchProductInfos } from "@/redux/store/slices/productSlices/get_products";
import { fetchProductUnits } from "@/redux/store/slices/productSlices/get_unit.slice";
import { fetchProjects } from "@/redux/store/slices/projectSlices/get_all_project.slice";
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
  const isAuthorized = useCheckRole([
    "admin-top",
    "price_quote",
    "price_quote-read",
  ]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchProjects());
      dispatch(fetchUserInfo());
      dispatch(fetchProductInfos());
      dispatch(fetchPriceQuotes({}));
      dispatch(fetchSystemProfits());
      dispatch(fetchProductUnits());
      dispatch(fetchTypePackage());
      dispatch(fetchSystemVats());
    }
  }, [dispatch, isAuthorized]);
  return (
    <div className="p-4">{isAuthorized ? <PriceQuote /> : <Forbiden />}</div>
  );
}
