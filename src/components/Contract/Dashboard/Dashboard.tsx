import React from "react";
import ChartColumn from "./Chart/ChartColumn";
import ChartDomain from "./Chart/ChartDomain";

// type Props = {}

export default function Dashboard() {
  return (
    <div className="flex w-full flex-wrap shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="flex-1 min-w-80">
        <ChartColumn />
      </div>
      <div className="flex-1 min-w-80">
        <ChartDomain />
      </div>
    </div>
  );
}
