/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ToolCustomer from "./ToolCustomer/ToolCustomer";
import ListCustomer from "./ListCustomer/ListCustomer";
import useCheckRole from "@/utils/CheckRole";
// type Props = {};


export default function Customer() {
  const isAuthorized = useCheckRole(["admin-top", "customer", "customer-edit"]);
  return (
    <div>
      <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
        {isAuthorized && (
          <div className="rounded-md">
            <ToolCustomer />
          </div>
        )}

        <div className="rounded-md">
          <ListCustomer />
        </div>
      </div>
    </div>
  );
}
