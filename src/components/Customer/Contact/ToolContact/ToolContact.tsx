import React from "react";

import ModalAddContact from "./ModalContact/ModalAddContact";

// type Props = {};

export default function ToolContact() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <ModalAddContact />
      </div>
    </div>
  );
}
