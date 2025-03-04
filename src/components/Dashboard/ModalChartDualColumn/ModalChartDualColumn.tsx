/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/plots";
import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import contractService from "@/services/contractService.";
interface DataType {
  contract_id: string;
  name_contract: string;
  status: string;
  total: number;
}
export default function ModalChartDualColumn() {
  const [dataType, setDataType] = useState<DataType[]>([]);
  // const [dataSelect, setDataSelect] = useState<string>("");
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
  // const [dataModal, setDataModal] = useState<
  //   { project: string; total: number }[]
  // >([]);

  const DemoColumn = () => {
    const data = dataType;

    const config = {
      data,
      xField: "name_contract",
      yField: "total",
      colorField: "status",
      group: true,
      style: {
        inset: 5,
      },
      onReady: ({ chart, ...rest }: any) => {
        // chart.on(
        //   "afterrender",
        //   () => {
        //     const { document } = chart.getContext().canvas;
        //     const elements = document.getElementsByClassName("element");
        //     elements[0]?.emit("click");
        //   },
        //   true
        // );
        // chart.on("element:click", (evt: any) => {
        //   // setDataSelect(evt.data.data.contract_id);
        //   console.log(evt);
        // });
      },
    };
    return <Column {...config} />;
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await contractService.getPaymentContractDashboard(dataSelect);
  //     if (res.statusCode === 200) {
  //       setDataModal(res.data);
  //     }
  //   };
  //   if (dataSelect !== "") {
  //     fetchData();
  //   }
  // }, [dataSelect]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await contractService.getPaymentContractDashboard();
      if (res.statusCode === 200) {
        const dataSource: DataType[] = res.data;
        setDataType(
          dataSource.map((dt) => {
            if (dt.status === "pending") {
              return { ...dt, status: "Chưa thanh toán" };
            }
            return { ...dt, status: "Đã thanh toán" };
          })
        );
      }
    };
    fetchData();
  }, []);

  return (
    <div className="sm:px-4 py-4 flex flex-col gap-4 max-w-full ">
      <p className="p-4 text-xl font-semibold">
        Thống kê thanh toán khách hàng
      </p>
      <div className="w-full">
        <DemoColumn />
      </div>
      {/* <Modal
        open={dataSelect !== ""}
        title={"Chi tiết thanh toán"}
        onCancel={() => {
          setDataSelect("");
          setDataModal([]);
        }}
        footer={null}
        width={"100%"}
      >
        <Table<{ project: string; total: number }>
          columns={columns}
          dataSource={dataModal}
          pagination={{
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          showSorterTooltip={{ target: "sorter-icon" }}
        />
      </Modal> */}
    </div>
  );
}
