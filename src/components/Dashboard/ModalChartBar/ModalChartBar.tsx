/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Bar } from "@ant-design/plots";
import contractService from "@/services/contractService.";
import { IGetTypeContract } from "@/models/contractInterface";
import priceQuoteService from "@/services/priceQuoteService";
import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";

export default function ModalChartBar() {
  const [dataType, setDataType] = useState<{ type: string; value: number }[]>(
    []
  );
  const [dataSelect, setDataSelect] = useState<string>("");
  const columns: ColumnsType<{ project: string; total: number }> = [
    {
      title: "Tên dự án",
      dataIndex: "project",
      key: "project",
    },
    {
      title: "Số tiền",
      dataIndex: "total",
      key: "total",
      render: (value: number) => {
        return (
          <>
            <strong className="flex gap-2 items-center">
              {value.toLocaleString("vi-vn")}đ
            </strong>
          </>
        );
      },
    },
  ];
  const [dataModal, setDataModal] = useState<
    { project: string; total: number }[]
  >([]);
  const DemoColumn = () => {
    const data = dataType;

    const config = {
      data,
      xField: "type",
      yField: "value",
      shapeField: "hollow",
      colorField: "type",
      state: {
        unselected: { opacity: 0.5 },
        selected: { lineWidth: 3, stroke: "red" },
      },
      interaction: {
        elementSelect: true,
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
        chart.on("element:click", (evt: any) => {
          setDataSelect(evt.data.data.type);
        });
      },
    };
    return <Bar {...config} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await priceQuoteService.getPriceQuoteRevenueByName(
        dataSelect
      );
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
      const res = await priceQuoteService.getPriceQuoteDashboard();
      if (res.statusCode === 200) {
        const dataSource: {
          type_package_name_package: string;
          type_package_package_id: string;
          total: number;
        }[] = res.data;
        setDataType(
          dataSource.map((dt) => {
            return {
              type: dt.type_package_name_package ?? "",
              value: dt.total ?? 0,
            };
          })
        );
      }
    };
    fetchData();
  }, []);

  return (
    <div className="sm:px-4 py-4 flex flex-col gap-4 max-w-full  h-full">
      <p className="p-4 text-xl font-semibold">Doanh thu theo gói</p>
      <div className="w-full">
        <DemoColumn />
      </div>
      <Modal
        open={dataSelect !== ""}
        title={"Chi tiết doanh thu gói " + dataSelect}
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
          scroll={{ x: "max-content" }}
          pagination={{
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          showSorterTooltip={{ target: "sorter-icon" }}
        />
      </Modal>
    </div>
  );
}
