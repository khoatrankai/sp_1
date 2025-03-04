import PriceQuote from "@/components/PriceQuote/PriceQuote";
import React from "react";

// type Props = {};

export default function TabPriceQuote() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <p className="text-xl">Báo giá</p>
      <PriceQuote />
    </div>
  );
}
