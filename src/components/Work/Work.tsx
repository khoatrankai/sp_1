import React from "react";
import ListWork from "./List/ListWork";
import ToolWork from "./Tool/ToolWork";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function Work() {
  const isAuthorized = useCheckRole([
    "admin-top",
    "activity",
    "activity-edit",
    "work",
    "work-edit",
  ]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className="rounded-md">
          <ToolWork />
        </div>
      )}

      <div className="rounded-md">
        <ListWork />
      </div>
    </div>
  );
}
