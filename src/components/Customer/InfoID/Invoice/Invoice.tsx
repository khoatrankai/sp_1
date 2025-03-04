import Payment from "@/components/Payment/Payment";
import React from "react";

// type Props = {};

export default function Invoice() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <p className="text-xl">Hóa đơn</p>
      <Payment />
    </div>
  );
}
