import React from "react";
import ListContract from "./List/ListContract";

// type Props = {}

export default function Contract() {
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      <div className="rounded-md">
        <ListContract />
      </div>
    </div>
  );
}
