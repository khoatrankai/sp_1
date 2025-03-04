import React from "react";
// import ListPropose from "./List/ListUser";
import ToolPriceQuote from "./Tool/ToolUser";
import ListUser from "./List/ListUser";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function User() {
  const isAuthorized = useCheckRole(["admin-top", "user", "user-edit"]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className="rounded-md">
          <ToolPriceQuote />
        </div>
      )}

      <div className="rounded-md">
        <ListUser />
      </div>
    </div>
  );
}
