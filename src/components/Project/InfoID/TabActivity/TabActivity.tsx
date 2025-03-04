import Activity from "@/components/Activity/Activity";
import React from "react";

// type Props = {};

export default function TabActivity() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <p className="text-xl">Hoạt động</p>
      <Activity />
    </div>
  );
}
