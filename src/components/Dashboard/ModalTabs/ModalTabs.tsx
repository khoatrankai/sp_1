import { Tabs } from "antd";
import React from "react";
// import { FaStar } from "react-icons/fa";
import ModalTabActivity from "./ModalTabActivity/ModalTabActivity";
import { FaBusinessTime } from "react-icons/fa";
import { RxActivityLog } from "react-icons/rx";
import ModalTabWork from "./ModalTabWork/ModalTabWork";
import { GiPayMoney } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";

import ModalTabPaymentReadyCustomer from "./ModalTabPaymentReadyCustomer/ModalTabPaymentReadyCustomer";
import ModalTabPaymentReadySupplier from "./ModalTabPaymentReadySupplier/ModalTabPaymentReadySupplier";
import ModalTabWorkUrgent from "./ModalTabWorkUrgent/ModalTabWorkUrgent";
import ModalTabWorkExpiredUrgent from "./ModalTabWorkExpiredUrgent/ModalTabWorkExpiredUrgent";
export default function ModalTabs() {
  const dataDashboard = [
    {
      name: "Công việc khẩn cấp",
      icon: FaBusinessTime,
      children: ModalTabWorkUrgent,
    },
    {
      name: "Công việc quá hạn",
      icon: FaBusinessTime,
      children: ModalTabWorkExpiredUrgent,
    },
    {
      name: "Hoạt động sắp tới",
      icon: RxActivityLog,
      children: ModalTabActivity,
    },
    {
      name: "Công việc sắp tới",
      icon: FaBusinessTime,
      children: ModalTabWork,
    },
    {
      name: "Hóa đơn đến hạn",
      icon: GiReceiveMoney,
      children: ModalTabPaymentReadyCustomer,
    },
    {
      name: "Công nợ NCC",
      icon: GiPayMoney,
      children: ModalTabPaymentReadySupplier,
    },
  ];
  return (
    <div className="flex gap-x-[30px] gap-y-[15px] flex-wrap max-w-full">
      <div className="bg-white min-h-[422px] flex-1 p-5 w-full">
        <Tabs
          defaultActiveKey="4"
          items={dataDashboard.map((dt, id) => {
            return {
              key: String(id),
              label: (
                <div className="flex items-center gap-4">
                  <dt.icon />
                  <p>{dt.name}</p>
                </div>
              ),
              children: <dt.children />,
            };
          })}
        />
      </div>
    </div>
  );
}
