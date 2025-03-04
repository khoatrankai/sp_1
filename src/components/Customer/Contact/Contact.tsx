import React from "react";
import ToolContact from "./ToolContact/ToolContact";
import ListContact from "./ListContact/ListContact";

// type Props = {};

export default function Contact() {
  return (
    <div>
      <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
        <div className="rounded-md">
          <ToolContact />
        </div>
        <div className="rounded-md">
          <ListContact />
        </div>
      </div>
    </div>
  );
}
