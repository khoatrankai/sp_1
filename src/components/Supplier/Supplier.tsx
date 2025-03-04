import React from "react";
import ToolSupplier from "./Tool/ToolSupplier";
import ListSupplier from "./List/ListSupplier";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function Supplier() {
  const isAuthorized = useCheckRole(["admin-top", "product", "product-edit"]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className="rounded-md">
          <ToolSupplier />
        </div>
      )}

      <div className="rounded-md">
        <ListSupplier />
      </div>
    </div>
  );
}
