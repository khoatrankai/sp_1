import React from "react";
import ToolActivityStatus from "./Tool/ToolActivityStatus";
import ListActivityStatus from "./List/ListActivityStatus";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function ActivityStatus() {
  const isAuthorized = useCheckRole(["admin-top", "product", "product-edit"]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className="rounded-md">
          <ToolActivityStatus />
        </div>
      )}

      <div className="rounded-md">
        <ListActivityStatus />
      </div>
    </div>
  );
}
