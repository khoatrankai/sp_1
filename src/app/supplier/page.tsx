/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Forbiden from "@/components/Forbiden/Forbiden";
import Supplier from "@/components/Supplier/Supplier";
import { fetchSuppliers } from "@/redux/store/slices/productSlices/get_supplier.slice";
import { AppDispatch } from "@/redux/store/store";
import useCheckRole from "@/utils/CheckRole";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// type Props = {}

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "product", "product-read"]);
  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchSuppliers());
    }
  }, [dispatch, isAuthorized]);
  return (
    <div className="p-4">{isAuthorized ? <Supplier /> : <Forbiden />}</div>
  );
}
