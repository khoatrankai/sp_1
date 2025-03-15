/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/plots";
import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import contractService from "@/services/contractService.";
import useCheckRole from "@/utils/CheckRole";

export default function ModalChartColumn() {
  const [dataType, setDataType] = useState<
    { type: string; value: number; type_id: string }[]
  >([]);
  const isAuthorized = useCheckRole(["admin-top", "contract"]);
  const [dataSelect, setDataSelect] = useState<string>("");
  // const columns: ColumnsType<{ project: string; total: number }> = [
  //   {
  //     title: "Tên hợp đồng",
  //     dataIndex: "name_contract",
  //     key: "name_contract",
  //   },
  //   {
  //     title: "Giá trị",
  //     dataIndex: "total",
  //     key: "total",
  //     render: (value: number) => {
  //       return (
  //         <>
  //           <strong className="flex gap-2 items-center">
  //             {value.toLocaleString("vi-vn")}đ
  //           </strong>
  //         </>
  //       );
  //     },
  //   },
  // ];
  const [dataModal, setDataModal] = useState<
    { project: string; total: number }[]
  >([]);

  const DemoColumn = () => {
    const data = dataType;

    const config = {
      data,
      xField: 'type',
      yField: 'value',
      legend: false,
      interactions: [
        {
          type: 'active-region',
          enable: false,
        },
  ],
      axis: {
        y: null
    },
    style: {
      // 圆角样式
      radius: 10,
      
    },
    };
    return <Column {...config} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await contractService.getFullContractByTypeID(dataSelect);
      if (res.statusCode === 200) {
        setDataModal(res.data);
      }
    };
    if (dataSelect !== "") {
      fetchData();
    }
  }, [dataSelect]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await contractService.getFullContractDashboard();
      if (res.statusCode === 200) {
        const dataSource: {
          type_id: string;
          name_type: string;
          total: number;
        }[] = res.data;
        setDataType(
          dataSource.map((dt) => {
            return {
              type: dt.name_type ?? "",
              value: dt.total ?? 0,
              type_id: dt.type_id,
            };
          })
        );
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-2 max-w-full w-full rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] h-96">
      <div>
      <p className="text-lg font-semibold">Dự án mới</p>
      <p className="text-sm font-light">Gần đây</p>
      </div>
      
      <div className="w-full h-full">
        <DemoColumn />
      </div>
      
    </div>
  );
}
