"use client";
import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import CircularProgress from "@mui/joy/CircularProgress";
interface DataType {
  key: string;
  name: string;
  target: number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Loại mục tiêu",
    dataIndex: "name",
  },
  {
    title: "Mục tiêu",
    dataIndex: "target",
    align: "right",
    render: (value: number) => (
      <CircularProgress determinate value={value}>
        {value}%
      </CircularProgress>
    ),
  },
];

const dataSource = [
  {
    key: "1",
    name: "John Brown",
    target: 10,
  },
  {
    key: "2",
    name: "John Brown",
    target: 20,
  },
];

const TableTarget = () => {
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

export default TableTarget;
