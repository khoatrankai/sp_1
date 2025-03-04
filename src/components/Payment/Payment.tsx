import React from "react";
import ListPayment from "./List/ListPayment";
import ToolPayment from "./Tool/ToolPayment";
import useCheckRole from "@/utils/CheckRole";

// type Props = {}

export default function Payment() {
  const isAuthorized = useCheckRole([
    "admin-top",
    "contract",
    "contract-edit",
    "payment",
    "payment-edit",
  ]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      {isAuthorized && (
        <div className="rounded-md">
          <ToolPayment />
        </div>
      )}

      <div className="rounded-md">
        <ListPayment />
      </div>
    </div>
  );
}
