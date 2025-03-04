import React from "react";
// import ListPropose from "./List/ListUser";
import ToolTimeKeeping from "./Tool/ToolTimeKeeping";
import ListTimeKeeping from "./List/ListTimeKeeping";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function TimeKeeping() {
  const isAuthorized = useCheckRole(["admin-top", "user", "user-edit"]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className="rounded-md">
          <ToolTimeKeeping />
        </div>
      )}

      <div className="rounded-md">
        <ListTimeKeeping />
      </div>
    </div>
  );
}
