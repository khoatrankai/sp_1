import React from "react";
import ModalUpdateCustomer from "../../ToolCustomer/ModalCustomer/ModalUpdateCustomer";

// type Props = {};

export default function CustomerInfo() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-xl">Thông tin khách hàng</p>
      <ModalUpdateCustomer />
    </div>
  );
}
