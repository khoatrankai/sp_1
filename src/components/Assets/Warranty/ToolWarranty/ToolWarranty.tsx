import React from "react";
import ModalAddWarranty from "./ModalWarranty/ModalAddWarranty";


type Props = {
  idAsset?:string
};

export default function ToolWarranty({idAsset}:Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <ModalAddWarranty idAsset={idAsset}/>
      </div>
    </div>
  );
}
