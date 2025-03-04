import { Select, Tabs, TabsProps } from "antd";
import React from "react";
import { useMedia } from "use-media";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import TabInfo from "./TabInfo/TabInfo";
import TabActivity from "./TabActivity/TabActivity";
import TabWork from "./TabWork/TabWork";
import TabInvoice from "./TabInvoice/TabInvoice";
import TabPriceQuote from "./TabPriceQuote/TabPriceQuote";

export default function InfoID() {
  const router = useRouter();
  const isMobile = useMedia({ maxWidth: 639 });
  const { projectID } = useParams();
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_projects
  );
  const tabs: TabsProps["items"] = [
    {
      label: "Thông tin dự án",
      key: "project",
      children: <TabInfo />,
    },
    {
      label: "Hoạt động",
      key: "activity",
      children: <TabActivity />,
    },
    {
      label: "Công việc",
      key: "work",
      children: <TabWork />,
    },
    {
      label: "Hóa đơn",
      key: "invoice",
      children: <TabInvoice />,
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
          placeholder="Dự án"
          style={{ minWidth: 120, flex: "1 1 0%" }}
          defaultValue={projectID}
          onChange={(e) => {
            router.push(
              `/admin/project/info/${e ? e : dataSources[0].project_id}`
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
            return { value: dt.project_id, label: dt.name };
          })}
        />
      </div>
      <div className="flex-1">
        <Tabs items={tabs} tabPosition={`${isMobile ? "top" : "right"}`} />
      </div>
    </div>
  );
}
