/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PieChart from "@/components/SaleComponent/PieChart/PieChart";
import { RootState } from "@/redux/store/store";
import customerService from "@/services/customerService";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// type Props = {}

export default function ChartPie() {
  const [dataSrcProvince, setDataSrcProvince] = useState<
    { name: string; y: number }[]
  >([]);
  const limit = 5;
  const { datas: dataProvinces } = useSelector(
    (state: RootState) => state.province_system
  );
  const [dataSrcGroup, setDataSrcGroup] = useState<
    { name: string; y: number }[]
  >([]);
  const fetchData = async () => {
    const res = await customerService.getChartCustomer();
    if (res.statusCode === 200) {
      const otherGroup = res.data.dashboard_group.reduce(
        (preValue: any, currValue: any, index: number) => {
          if (index + 1 > limit) {
            return currValue.customers + preValue;
          }
          return preValue;
        },
        0
      );
      const otherProvince = res.data.dashboard_province.reduce(
        (preValue: any, currValue: any, index: number) => {
          if (index + 1 > limit) {
            return currValue.count + preValue;
          }
          return preValue;
        },
        0
      );

      setDataSrcGroup([
        ...res.data.dashboard_group
          .filter((dt: any, index: number) => {
            return index + 1 <= limit;
          })
          .map((dt: any) => {
            return { name: dt.name_group, y: dt.customers };
          }),
        { name: "Khác", y: otherGroup },
      ]);
      setDataSrcProvince([
        ...res.data.dashboard_province
          .filter((dt: any, index: number) => {
            return index + 1 <= limit;
          })
          .map((dt: any) => {
            return {
              name: dataProvinces.find((dtt) => dtt.province_id === dt.id)
                ?.name_province,
              y: dt.count,
            };
          }),
        { name: "Khác", y: otherProvince },
      ]);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dataProvinces]);
  return (
    <div className="flex justify-between p-4 lg:flex-nowrap flex-wrap gap-8">
      <div className="p-4 flex-1 min-w-80">
        <PieChart
          dataSrc={dataSrcProvince}
          titleSrc={'<p class="slim-dashboard-title">Khách hàng khu vực</p>'}
          subTitleSrc={``}
        />
      </div>
      <div className="p-4 flex-1 min-w-80">
        <PieChart
          dataSrc={dataSrcGroup}
          titleSrc={'<p class="slim-dashboard-title">Nhóm khách hàng</p>'}
          subTitleSrc={``}
        />
      </div>
    </div>
  );
}
