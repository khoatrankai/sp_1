import React from "react";
import ToolActivityImport from "./Tool/ToolActivityImport";
import ListActivityImport from "./List/ListActivityImport";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function ActivityImport() {
  const isAuthorized = useCheckRole(["admin-top", "product", "product-edit"]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className="rounded-md">
          <ToolActivityImport />
        </div>
      )}

      <div className="rounded-md">
        <ListActivityImport />
      </div>
    </div>
  );
}
