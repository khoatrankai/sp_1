import React from "react";
import ListCompany from "./ListCompany/ListCompany";

// type Props = {};

export default function Company() {
  return (
    <div>
      <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
        <div className="rounded-md">
          <ListCompany />
        </div>
      </div>
    </div>
  );
}
