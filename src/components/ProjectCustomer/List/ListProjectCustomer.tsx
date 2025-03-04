/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGetProject } from "@/models/projectInterface"; // Import the IGetProject interface
import { Select, Table, TableColumnsType, Tag } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";

import customerService from "@/services/roleCustomerService/customerService";

export default function ListProjectCustomer() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const [dataFilter, setDataFilter] = useState<
    IGetProject[] | [] | undefined
  >();
  const [dataSource, setDataSource] = useState<IGetProject[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res: any = customerService.getAllProjectByToken();
      if (res.statusCode === 200) {
        setDataSource(res.data);
      }
    };
    fetchData();
  }, []);
  const columns: TableColumnsType<IGetProject> = [
    {
      title: "#",
      className: "",
      dataIndex: "project_id",
      render: (value: string, record, index) => (
        <div className="flex flex-col gap-1">
          <strong>
            #{index + 1}.{`${value.slice(0, 10)}...`}
          </strong>
        </div>
      ),
      sorter: (a: IGetProject, b: IGetProject) =>
        a.project_id.localeCompare(b.project_id),
    },
    {
      title: "Tên dự án",
      className: "",
      dataIndex: "name",
      render: (value: string) => (
        <>{value && value.length > 15 ? `${value.slice(0, 15)}...` : value}</>
      ),
      sorter: (a: IGetProject, b: IGetProject) =>
        a.name?.localeCompare(b.name || "") || 0,
    },
    {
      title: "Công ty",
      className: "",
      dataIndex: ["customer", "name_company"],
      render: (value: string) => <>{value || "N/A"}</>,
    },

    {
      title: "Giá trị",
      className: "",
      dataIndex: "price",
      render: (value: number) =>
        value ? `${value.toLocaleString("vi-VN")}đ` : "N/A",
      sorter: (a: IGetProject, b: IGetProject) =>
        (a.price || 0) - (b.price || 0),
    },

    {
      title: "Ngày bắt đầu",
      className: "",
      dataIndex: "start_date",
      render: (value: Date) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày kết thúc",
      className: "",
      dataIndex: "end_date",
      render: (value: Date) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      className: "",
      dataIndex: "status",
      render: (
        status: "waiting" | "start" | "pause" | "cancel" | "completed"
      ) => {
        let color = "";
        let text = "";

        switch (status) {
          case "waiting":
            color = "gold";
            text = "Đang chờ";
            break;
          case "start":
            color = "blue";
            text = "Bắt đầu";
            break;
          case "pause":
            color = "orange";
            text = "Tạm dừng";
            break;
          case "cancel":
            color = "red";
            text = "Đã hủy";
            break;
          case "completed":
            color = "green";
            text = "Hoàn thành";
            break;
          default:
            color = "default";
            text = "Không xác định";
        }

        return (
          <Tag className="" color={color}>
            {text}
          </Tag>
        );
      },
      sorter: (a: IGetProject, b: IGetProject) =>
        a.status.localeCompare(b.status),
    },
  ];

  useEffect(() => {
    setDataFilter(
      dataSource.map((dt, index) => {
        return { ...dt, key: index };
      })
    );
  }, [dataSource]);

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSource?.filter((project) => {
        return (
          project.project_id +
          " " +
          project.name +
          " " +
          project.customer +
          " " +
          project.status
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2 flex-wrap gap-y-2">
        <div className="flex items-center gap-1">
          <Select
            defaultValue={pageLimit}
            style={{ width: 83 }}
            onChange={(value) => setPageLimit(value)}
            options={[
              { value: 10, label: 10 },
              { value: 25, label: 25 },
              { value: 50, label: 50 },
              { value: 100, label: 100 },
              { value: 500, label: 500 },
              { value: 1000, label: 1000 },
              { value: 100000000, label: "All" },
            ]}
          />
        </div>
        <div className="flex items-center">
          <Search
            onChange={(e) => handleSearchFilter(e.target.value)}
            placeholder="Search"
            style={{ width: 200 }}
          />
        </div>
      </div>
      <div className="w-full overflow-auto">
        <div className="min-w-fit">
          <Table<IGetProject>
            columns={columns}
            dataSource={dataFilter}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: pageLimit,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            showSorterTooltip={{ target: "sorter-icon" }}
          />
        </div>
      </div>
    </div>
  );
}
