"use client";
import React from "react";
import ToolOpportunity from "./Tool/ToolOpportunity";
import ListOpportunities from "./ListOpportunity/ListOpportunity";
import useCheckRole from "@/utils/CheckRole";

export default function Opportunity() {
  const isAuthorized = useCheckRole([
    "admin-top",
    "opportunity",
    "opportunity-edit",
  ]);
  return (
    <div>
      <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
        {isAuthorized && (
          <div className="rounded-md">
            <ToolOpportunity />
          </div>
        )}

        <div className="rounded-md">
          <ListOpportunities />
        </div>
      </div>
    </div>
  );
}
