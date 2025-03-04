import React, { useEffect } from "react";
import ModalChartBar from "./ModalChartBar/ModalChartBar";
import ModalChartColumn from "./ModalChartColumn/ModalChartColumn";
import ModalTableDebt from "./ModalTableDebt/ModalTableDebt";
import ModalChartDualColumn from "./ModalChartDualColumn/ModalChartDualColumn";
import ModalExpiredCustomer from "./ModalExpiredCustomer/ModalExpiredCustomer";
import ModalPieChart from "./ModalPieChart/ModalPieChart";
import ModalPieChartOpportunity from "./ModalPieChartOpportunity/ModalPieChartOpportunity";
import ChartColumn from "../Customer/Dashboard/ChartColumn";
import ModalTableContractNew from "./ModalTableContractNew/ModalTableContractNew";
import ModalTabs from "./ModalTabs/ModalTabs";
import useCheckRole from "@/utils/CheckRole";

export default function Dashboard() {
  const isAuthorizedContract = useCheckRole(["admin-top", "contract"]);
  const isAuthorizedCustomer = useCheckRole(["admin-top", "customer"]);
  useEffect(() => {
    console.log(isAuthorizedContract);
  }, [isAuthorizedContract]);
  return (
    <div className="flex flex-col gap-4 sm:px-4 py-4 w-screen sm:w-auto">
      <div className="gap-4 flex-wrap">
        <div className="flex-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] min-w-96">
          <ModalTabs />
        </div>
      </div>
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] min-w-72">
          <ModalPieChart />
        </div>
        <div className="flex-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] min-w-72">
          <ModalPieChartOpportunity />
        </div>
        <div className="flex-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] min-w-72">
          <ModalChartColumn />
        </div>
      </div>
      {isAuthorizedContract && (
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] min-w-72">
            <ModalExpiredCustomer />
          </div>
          <div className="flex-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] min-w-72">
            <ModalTableDebt />
          </div>
          <div className="flex-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] min-w-72">
            <ModalTableContractNew />
          </div>
        </div>
      )}

      <div className="flex gap-4  flex-wrap">
        <div className="flex-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] min-w-72">
          <ModalChartBar />
        </div>
        {isAuthorizedContract && (
          <div className="flex-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] min-w-72">
            <ModalChartDualColumn />
          </div>
        )}
      </div>
      {isAuthorizedCustomer && (
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] min-w-72">
            <ChartColumn />
          </div>
        </div>
      )}
    </div>
  );
}
