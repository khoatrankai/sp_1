import { IGetListDetail } from "@/models/productInterface";
import { Table, TableColumnsType } from "antd";
import React from "react";

type Props = {
  dataDetail: IGetListDetail[];
};

export default function TabDetail({ dataDetail }: Props) {
  const columns: TableColumnsType<IGetListDetail> = [
    {
      title: "Tên thành phần",
      dataIndex: "title",
      className: "text-xs",
      render: (value?: string) => value || "N/A",
    },
    {
      title: "Mô tả",
      dataIndex: ["description"],
      className: "text-xs",
      render: (value?: string) => value || "N/A",
    },
  ];
  return (
    <div>
      <p className="font-semibold">Thông tin kỹ thuật</p>
      <Table<IGetListDetail>
        columns={columns}
        scroll={{ x: "max-content" }}
        className="custom-table"
        // rowSelection={rowSelection}
        dataSource={dataDetail}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </div>
  );
}
