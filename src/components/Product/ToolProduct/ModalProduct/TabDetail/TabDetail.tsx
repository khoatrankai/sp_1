/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Button, Input, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { IoIosAdd, IoMdRemoveCircleOutline } from "react-icons/io";
import { IGetListDetail } from "@/models/productInterface";
type Props = {
  data?: IGetListDetail[];
  setData?: any;
};
const TabDetail = ({ data, setData }: Props) => {
  const columns: ColumnsType<IGetListDetail> = [
    {
      title: "Thành phần",
      dataIndex: "title",
      width: "50%",
      key: "title",
      render: (value, record, index) => {
        return (
          <>
            <Input
              placeholder="Thành phần"
              value={value}
              onChange={(e) => {
                setData((preValue: IGetListDetail[]) => {
                  return preValue.map((dt, i) => {
                    if (i === index) {
                      return { ...dt, title: e.target.value ?? "" };
                    }
                    return dt;
                  });
                });
              }}
            />
          </>
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: "50%",
      key: "description",
      render: (value, record, index) => {
        return (
          <>
            <Input.TextArea
              autoSize={{ minRows: 1 }}
              placeholder="Mô tả"
              value={value}
              onChange={(e) => {
                setData((preValue: IGetListDetail[]) => {
                  return preValue.map((dt, i) => {
                    if (i === index) {
                      return { ...dt, description: e.target.value ?? "" };
                    }
                    return dt;
                  });
                });
              }}
            />
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "",
      width: "30%",
      key: "",
      render: (value, record, index) => {
        return (
          <>
            <Button
              danger
              icon={<IoMdRemoveCircleOutline color="red" />}
              onClick={() => {
                setData((preValue: IGetListDetail[]) => {
                  return preValue.filter((dt, i) => {
                    return i !== index;
                  });
                });
              }}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          className="bg-orange-500 text-white font-semibold"
          icon={<IoIosAdd />}
          onClick={() => {
            setData((preValue: IGetListDetail[]) => {
              return [...preValue, { title: "", description: "" }];
            });
          }}
        />

        <div className="border-t-2 w-full overflow-x-auto">
          <div className="w-full">
            <Table<IGetListDetail>
              columns={columns}
              scroll={{ x: "max-content" }}
              className="custom-table"
              dataSource={data}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              showSorterTooltip={{ target: "sorter-icon" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TabDetail;
