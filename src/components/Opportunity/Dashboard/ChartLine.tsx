/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import { Select } from "antd";
import { Option } from "antd/es/mentions";

import opportunityService from "@/services/opportunityService.";
import { IGetOpportunitiesDto } from "@/models/opportunityInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
// type Props = {}
export default function ChartLine() {
  const currentYear = new Date().getFullYear();

  const { datas: dataSourceOpportunity } = useSelector(
    (state: RootState) => state.source_opportunity
  );
  const [dataType, setDataType] = useState<
    { month: string; value: number; type: string }[]
  >([]);
  const DemoColumn = () => {
    const data = dataType;
    const config = {
      data,
      xField: "month",
      yField: "value",
      colorField: "type",
      axis: {
        y: {
          labelFormatter: (v: any) =>
            `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
        },
      },
      legend: {
        color: {
          title: false,
          position: "right",
          rowPadding: 5,
        },
      },
      onReady: ({ chart, ...rest }: any) => {
        chart.on(
          "afterrender",
          () => {
            // const { document } = chart.getContext().canvas;
            // const elements = document.getElementsByClassName("element");
            // elements[0]?.emit("click");
            console.log("ca")
          },
          true
        );
        chart.on("element:click", (evt: any) => {
          // if (isAuthorized) setDataSelect(evt.data.data.type_id);
          console.log("bam")
        });
        
      },
      // style: {
      //   lineWidth: 2,
      //   lineDash: (data: any) => {
      //     if (data[0].type === "register") return [4, 4];
      //   },
      //   opacity: (data: any) => {
      //     if (data[0].type !== "register") return 0.5;
      //   },
      // },
    };
    return <Line {...config} />;
  };

  const [yearNumber, setYearNumber] = useState<number>(currentYear);

  useEffect(() => {
    console.log(yearNumber);
    const fetchData = async () => {
      if (yearNumber) {
        const filter = {
          time_first: new Date(yearNumber + `-01-01`).getTime(),
          time_end: new Date(yearNumber + `-12-31`).getTime(),
        };
        const res = await opportunityService.getFilterOpportunity(filter);
        if (res.statusCode === 200) {
          const dataSource: IGetOpportunitiesDto[] = res.data;
          const dataOK = Array.from({
            length: 12 * dataSourceOpportunity.length,
          }).map((dt, i) => {
            const index = Math.floor(i / 12);
            const month = i % 12;
            const id_source = dataSourceOpportunity[index].type_source_id;
            const value = dataSource.filter(
              (dt) =>
                new Date(dt.created_at).getMonth() === month &&
                dt.type_source.type_source_id === id_source
            );
            return {
              month: "Tháng " + (month + 1),
              type: dataSourceOpportunity[index].name,
              value: value.length,
            };
          });
          setDataType(dataOK);
        }
      }
    };
    fetchData();
  }, [yearNumber]);

  return (
    <div className="p-4 flex flex-col gap-4 max-w-full border-b-[1px]">
      <div className="p-4 flex justify-between flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          <Select
            placeholder="Chọn năm"
            showSearch
            value={yearNumber}
            onChange={(e) => {
              setYearNumber(Number(e));
            }}
            filterOption={(input, option) => {
              const text = Array.isArray(option?.children)
                ? option.children.join("")
                : option?.children ?? "";
              return text.toLowerCase().includes(input.toLowerCase());
            }}
          >
            {Array.from(
              { length: currentYear - 2018 + 1 },
              (_, i) => 2018 + i
            ).map((dt) => (
              <Option key={dt.toString()} value={dt.toString()}>
                {dt}
              </Option>
            ))}
            {/* {dataGroups?.map((dt) => (
              <Option key={dt.group_id} value={dt.group_id}>
                {dt.name_group}
              </Option>
            ))} */}
          </Select>
        </div>
      </div>
      <p className="p-4 text-xl font-semibold">Thống kê nguồn cơ hội</p>
      <div className="w-full">
        {" "}
        <DemoColumn />{" "}
      </div>
    </div>
  );
}
