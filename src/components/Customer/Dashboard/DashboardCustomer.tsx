import dynamic from "next/dynamic";
import React from "react";
const ChartColumn = dynamic(
  () => import("@/components/Customer/Dashboard/ChartColumn")
);
const ChartPie = dynamic(
  () => import("@/components/Customer/Dashboard/ChartPie")
);
// type Props = {}

export default function DashboardCustomer() {
  return (
    <div className="flex flex-col gap-4 max-w-full">
      <ChartPie />
      <ChartColumn />
    </div>
  );
}
