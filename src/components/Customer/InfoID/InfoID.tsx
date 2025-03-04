import { Select, Tabs, TabsProps } from "antd";
import React from "react";
import CustomerInfo from "./CustomerInfo/CustomerInfo";
import Invoice from "./Invoice/Invoice";
import TabProject from "./Project/Project";
import TabContract from "./TabContract/TabContract";
import TabPriceQuote from "./TabPriceQuote/TabPriceQuote";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import TabContact from "./TabContact/TabContact";
import useMedia from "use-media";

export default function InfoID() {
  const isMobile = useMedia({ maxWidth: 639 });
  const router = useRouter();
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.infos_customer
  );
  const { customerID } = useParams();
  const tabs: TabsProps["items"] = [
    {
      label: "Thông tin khách hàng",
      key: "customer",
      children: <CustomerInfo />,
    },
    {
      label: "Liên hệ",
      key: "contact",
      children: <TabContact />,
    },
    {
      label: "Hóa đơn",
      key: "invoice",
      children: <Invoice />,
    },
    {
      label: "Dự án",
      key: "project",
      children: <TabProject />,
    },
    {
      label: "Hợp đồng",
      key: "contract",
      children: <TabContract />,
    },
    {
      label: "Báo giá",
      key: "price_quote",
      children: <TabPriceQuote />,
    },
  ];
  return (
    <div className="flex flex-col">
      <div>
        <Select
          placeholder="Khách hàng"
          style={{ minWidth: 120, flex: "1 1 0%" }}
          defaultValue={customerID}
          onChange={(e) => {
            router.push(
              `/admin/customer/info/${e ? e : dataSources[0].info_id}`
            );
          }}
          showSearch
          allowClear
          filterOption={(input, option) => {
            return ((option?.label ?? "") as string)
              .toLowerCase()
              .includes(input.toLowerCase());
          }}
          options={dataSources.map((dt) => {
            return { value: dt.info_id, label: dt.name_company };
          })}
        />
      </div>
      <div className="flex-1">
        <Tabs items={tabs} tabPosition={`${isMobile ? "top" : "right"}`} />
      </div>
    </div>
  );
}
