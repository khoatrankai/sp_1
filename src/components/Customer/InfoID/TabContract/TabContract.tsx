import Contract from "@/components/Contract/Contract";
import React from "react";

// type Props = {};

export default function TabContract() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <p className="text-xl">Hợp đồng</p>
      <Contract />
    </div>
  );
}
