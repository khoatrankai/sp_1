"use client";
import React from "react";
import { Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
const { Text } = Typography;
interface DataType {
  key: string;
  name: string;
  revenue: number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Tên nhân viên",
    dataIndex: "name",
  },
  {
    title: "Doanh thu",
    dataIndex: "revenue",
    align: "right",
    render: (value: number) => <Text>{value.toLocaleString()}</Text>,
  },
];

const dataSource = [
  {
    key: "1",
    name: "John Brown",
    revenue: 1000000,
  },
  {
    key: "2",
    name: "John Brown",
    revenue: 1000000,
  },
];

const TableRevenue = () => {
  return (
    <Table<DataType>
      className="max-h-52"
      bordered
      columns={columns}
      scroll={{ x: "max-content" }}
      dataSource={dataSource as DataType[]}
      pagination={false}
    />
  );
};

export default TableRevenue;
