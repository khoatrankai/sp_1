"use client";

import dynamic from "next/dynamic";

// import SaleComponent from "@/components/SaleComponent/SaleComponent";
const Dashboard = dynamic(() => import("@/components/Dashboard/Dashboard"));

export default function page() {
  return (
    <>
      {/* <SaleComponent /> */}
      <Dashboard />
    </>
  );
}
