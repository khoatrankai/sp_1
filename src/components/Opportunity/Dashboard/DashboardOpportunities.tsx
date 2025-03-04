import dynamic from "next/dynamic";
import React from "react";
import TabList from "./TabList";
const ChartColumn = dynamic(
  () => import("@/components/Opportunity/Dashboard/ChartColumn")
);
const ChartPie = dynamic(
  () => import("@/components/Opportunity/Dashboard/ChartPie")
);

const ChartLine = dynamic(
  () => import("@/components/Opportunity/Dashboard/ChartLine")
);
// type Props = {}

export default function DashboardOpportunities() {
  return (
    <div className="flex flex-col gap-4 max-w-full">
      <div className="border-b-[1px]">
      <ChartPie />
      </div>
   
      <ChartColumn />
      
      <ChartLine />
      <TabList/>
    </div>
  );
}
