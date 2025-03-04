import React from "react";
import ListContract from "./List/ListContract";
import ToolContract from "./Tool/ToolContract";
import Dashboard from "./Dashboard/Dashboard";
import { useParams } from "next/navigation";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function Contract() {
  const { customerID } = useParams();
  const isAuthorized = useCheckRole(["admin-top", "contract", "contract-edit"]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className="rounded-md">
          <ToolContract />
        </div>
      )}

      {!customerID && (
        <div className="flex" hidden={customerID ? true : false}>
          <Dashboard />
        </div>
      )}

      <div className="rounded-md">
        <ListContract />
      </div>
    </div>
  );
}
