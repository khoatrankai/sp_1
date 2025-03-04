import Work from "@/components/Work/Work";
import React from "react";

// type Props = {};

export default function TabWork() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <p className="text-xl">Công việc</p>
      <Work />
    </div>
  );
}
