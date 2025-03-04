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
  const columns: ColumnsType<{ project: string; total: number }> = [
    {
      title: "Tên hợp đồng",
      dataIndex: "name_contract",
      key: "name_contract",
    },
    {
      title: "Giá trị",
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
          if (isAuthorized) setDataSelect(evt.data.data.type_id);
        });
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
    <div className="p-4 flex flex-col gap-4 max-w-full">
      <p className="p-4 text-xl font-semibold">Giá trị gói hợp đồng</p>
      <div className="w-full">
        <DemoColumn />
      </div>
      <Modal
        open={dataSelect !== ""}
        title={"Chi tiết gói hợp đồng "}
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
