/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Forbiden from "@/components/Forbiden/Forbiden";
import Payment from "@/components/Payment/Payment";
import { fetchTypeMethods } from "@/redux/store/slices/activitySlices/type_method.slice";
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
// import { fetchTypeContracts } from "@/redux/store/slices/contractSlices/type_contract.slide";
import { fetchSuppliers } from "@/redux/store/slices/productSlices/get_supplier.slice";
import { fetchProductTypes } from "@/redux/store/slices/productSlices/get_type.slice";
import { fetchSystemVats } from "@/redux/store/slices/systemSlices/get_vat.slice";
// import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
// import { fetchTypeContracts } from "@/redux/store/slices/contractSlices/type_contract.slide";
// import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
// import { fetchPriceQuotes } from "@/redux/store/slices/priceQuoteSlices/get_price_quotes.slice";
// import { fetchProductInfos } from "@/redux/store/slices/productSlices/get_products";
// import { fetchProjects } from "@/redux/store/slices/projectSlices/get_all_project.slice";
// import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole([
    "admin-top",
    "payment",
    "payment-read",
    "contract-read",
    "contract",
  ]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchTypeMethods());
      dispatch(fetchSuppliers());
      dispatch(fetchSystemVats());
      dispatch(fetchContracts(null));
      dispatch(fetchProductTypes());
    }
  }, [dispatch, isAuthorized]);
  return <div className="p-4">{isAuthorized ? <Payment /> : <Forbiden />}</div>;
}
