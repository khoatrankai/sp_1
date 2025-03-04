import { Tabs, TabsProps } from "antd";
import React, { useState } from "react";

import useMedia from "use-media";
import Reports from "./Reports";
import ReportRevenue from "./ReportRevenue/ReportRevenue";
import ReportWork from "./ReportWork/ReportWork";
import ReportDebt from "./ReportDebt/ReportDebt";
import ReportExpired from "./ReportExpired/ReportExpired";

export default function TabReport() {
  const isMobile = useMedia({ maxWidth: 639 });
  const [tabSelect, setTabSelect] = useState<string>("report-work");

  const tabs: TabsProps["items"] = [
    {
      label: "Báo cáo công việc",
      key: "report-work",
      children: tabSelect === "report-work" && <ReportWork />,
    },
    {
      label: "Báo cáo doanh thu",
      key: "report-revenue",
      children: tabSelect === "report-revenue" && <ReportRevenue />,
    },
    {
      label: "Báo cáo công nợ phải thu",
      key: "report-debt-customer",
      children: tabSelect === "report-debt-customer" && <ReportExpired />,
    },
    {
      label: "Báo cáo công nợ nhà cung cấp",
      key: "report-debt-supplier",
      children: tabSelect === "report-debt-supplier" && <ReportDebt />,
    },
  ];
  return (
    <div className="flex flex-col p-4">
      <div className="w-full">
        <Reports />
      </div>
      <div className="flex-1">
        <Tabs
          items={tabs}
          tabPosition={`${isMobile ? "top" : "right"}`}
          onChange={(e) => {
            setTabSelect(e);
          }}
        />
      </div>
    </div>
  );
}
