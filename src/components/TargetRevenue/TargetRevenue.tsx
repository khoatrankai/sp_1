import React from "react";
import ToolTargetRevenue from "./Tool/ToolTargetRevenue";
import ListTargetRevenue from "./List/ListTargetRevenue";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function TargetRevenue() {
  const isAuthorized = useCheckRole(["admin-top", "system", "system-edit"]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className="rounded-md">
          <ToolTargetRevenue />
        </div>
      )}

      <div className="rounded-md">
        <ListTargetRevenue />
      </div>
    </div>
  );
}
