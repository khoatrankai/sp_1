import React from "react";
import ListPropose from "./List/ListPriceQuote";
import ToolPriceQuote from "./Tool/ToolPriceQuote";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function PriceQuote() {
  const isAuthorized = useCheckRole([
    "admin-top",
    "price_quote",
    "price_quote-edit",
  ]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className="rounded-md">
          <ToolPriceQuote />
        </div>
      )}

      <div className="rounded-md">
        <ListPropose />
      </div>
    </div>
  );
}
