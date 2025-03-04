import React from "react";
import ListActivity from "./List/ListActivity";
import ToolActivity from "./Tool/ToolActivity";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function Activity() {
  const isAuthorized = useCheckRole(["admin-top", "activity", "activity-edit"]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className=" p-2 ">
          <ToolActivity />
        </div>
      )}

      <div className=" p-2">
        <ListActivity />
      </div>
    </div>
  );
}
