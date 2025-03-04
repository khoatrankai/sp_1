/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Area } from "@ant-design/plots";
import contractService from "@/services/contractService.";
import { IGetTypeContract } from "@/models/contractInterface";
// type Props = {}

export default function ChartDomain() {
  const [dataType, setDataType] = useState<{ type: string; value: number }[]>(
    []
  );
  const DemoColumn = () => {
    const data = dataType;

    const config = {
      data,
      xField: "type",
      yField: "value",
      style: {
        fill: () => {
          // if (type === "10-30分" || type === "30+分") {
          //   return "#22CBCC";
          // }
          return "#2989FF";
        },
      },
      // label: {
      //   text: (originData: any) => {
      //     return typeTime === "day" ? "" : originData.type;
      //   },
      //   offset: 10,
      // },
      xAxis: {
        label: {
          style: {
            fill: "#FF0000", // Màu chữ trục x
            rotate: Math.PI / 4, // Xoay 45 độ
          },
        },
      },
      legend: false,
    };
    return <Area {...config} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await contractService.getTypeFullContracts();
      if (res.statusCode === 200) {
        const dataSource: IGetTypeContract[] = res.data;
        setDataType(
          dataSource.map((dt) => {
            return {
              type: dt.name_type ?? "",
              value:
                dt.contracts?.reduce((preValue, currValue) => {
                  return preValue + (currValue.price ?? 0);
                }, 0) ?? 0,
            };
          })
        );
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4 max-w-full">
      <p className="p-4 text-xl font-semibold">Hợp đồng theo loại</p>
      <div className="w-full">
        <DemoColumn />
      </div>
    </div>
  );
}
