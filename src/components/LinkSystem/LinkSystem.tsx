import React from "react";
import ToolLinkSystem from "./Tool/ToolLinkSystem";
import ListLinkSystem from "./List/ListLinkSystem";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function LinkSystem() {
  const isAuthorized = useCheckRole(["admin-top", "system", "system-edit"]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className="rounded-md">
          <ToolLinkSystem />
        </div>
      )}

      <div className="rounded-md">
        <ListLinkSystem />
      </div>
    </div>
  );
}
