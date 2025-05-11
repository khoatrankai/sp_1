"use client";

import dynamic from "next/dynamic";

// import SaleComponent from "@/components/SaleComponent/SaleComponent";
const SaleComponent = dynamic(
  () => import("@/components/SaleComponent/SaleComponent"),
  { ssr: false }
);
export default function Dashboard() {
  return (
    <>
      <SaleComponent />
    </>
  );
}
