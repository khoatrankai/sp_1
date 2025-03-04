import Project from "@/components/Project/Project";
import React from "react";

// type Props = {};

export default function TabProject() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <p className="text-xl">Hóa đơn</p>
      <Project />
    </div>
  );
}
