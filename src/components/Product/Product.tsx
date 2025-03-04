import React from "react";
import ToolProduct from "./ToolProduct/ToolProduct";
import ListProduct from "./ListProduct/ListProduct";
import useCheckRole from "@/utils/CheckRole";

// type Props = {};

export default function Product() {
  const isAuthorized = useCheckRole(["admin-top", "product", "product-edit"]);
  return (
    <div>
      <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
        {isAuthorized && (
          <div className="rounded-md">
            <ToolProduct />
          </div>
        )}

        <div className="rounded-md">
          <ListProduct />
        </div>
      </div>
    </div>
  );
}
