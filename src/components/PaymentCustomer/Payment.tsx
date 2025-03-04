import React from "react";
import ListPayment from "./List/ListPayment";

// type Props = {}

export default function Payment() {
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      <div className="rounded-md">
        <ListPayment />
      </div>
    </div>
  );
}
