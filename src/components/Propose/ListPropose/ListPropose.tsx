import { GetPropose } from "@/models/proposeInterface";
import { Button, Dropdown, Select, Table, TableColumnsType, Tag } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";

type Props = {
  dataSource?: GetPropose[] | [];
};

export default function ListPropose({ dataSource }: Props) {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const [dataFilter, setDataFilter] = useState<GetPropose[] | [] | undefined>(
    dataSource
  );
  const columns: TableColumnsType<GetPropose> = [
    {
      title: "Đề xuất#",
      className: "text-xs",
      dataIndex: "propose_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>
            #{index + 1}.{`${value.slice(0, 10)}...`}
          </strong>
          <div className="flex gap-2">
            <Button type="text" ghost className="text-xs text-blue-600">
              Xem
            </Button>
            <Button type="text" ghost className="text-xs text-yellow-600">
              Chỉnh sửa
            </Button>
          </div>
        </div>
      ),
      sorter: (a: GetPropose, b: GetPropose) =>
        a.propose_id.localeCompare(b.propose_id),
    },
    {
      title: "Tiêu đề",
      className: "text-xs",
      dataIndex: "name_propose",
      render: (value: string) => (
        <>{value.length > 15 ? `${value.slice(0, 15)}...` : value}</>
      ),
      sorter: (a: GetPropose, b: GetPropose) =>
        a.name_propose.localeCompare(b.name_propose),
    },
    {
      title: "Gửi đến",
      className: "text-xs",
      dataIndex: "send_to",
      render: (value: string) => (
        <>{value.length > 15 ? `${value.slice(0, 15)}...` : value}</>
      ),
      sorter: (a: GetPropose, b: GetPropose) =>
        a.send_to.localeCompare(b.send_to),
    },
    {
      title: "Tổng cộng",
      className: "text-xs",
      dataIndex: "price",
      sorter: (a: GetPropose, b: GetPropose) => a.price - b.price,
      render: (value) => {
        return `${value.toLocaleString("vi-VN")}đ`;
      },
    },
    {
      title: "Ngày đề xuất",
      className: "text-xs",
      dataIndex: "date_start",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: GetPropose, b: GetPropose) =>
        a.date_start.localeCompare(b.date_start),
    },
    {
      title: "Ngày hết hạn",
      className: "text-xs",
      dataIndex: "date_end",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: GetPropose, b: GetPropose) =>
        a.date_end.localeCompare(b.date_end),
    },
    {
      title: "Ngày tạo",
      className: "text-xs",
      dataIndex: "created_at",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: GetPropose, b: GetPropose) =>
        a.created_at.localeCompare(b.created_at),
    },
    {
      title: "Tình trạng",
      className: "text-xs",
      dataIndex: "status",
      render: (value: string) => (
        <>
          <Tag
            color={
              value === "draff"
                ? "gray"
                : value === "send"
                ? "lightblue"
                : value === "open"
                ? "blue"
                : value === "edit"
                ? "yellow"
                : value === "refuse"
                ? "red"
                : value === "accept"
                ? "green"
                : ""
            }
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}{" "}
            {/* Chuyển chữ cái đầu thành viết hoa */}
          </Tag>
        </>
      ),
      sorter: (a: GetPropose, b: GetPropose) =>
        a.status.localeCompare(b.status),
    },
  ];
  useEffect(() => {
    setDataFilter(
      dataSource?.map((dt, index) => {
        return { ...dt, key: index };
      })
    );
  }, [dataSource]);

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSource?.filter((dt) => {
        return String(
          dt.created_at +
            " " +
            dt.date_end +
            " " +
            dt.date_start +
            " " +
            dt.name_propose +
            " " +
            dt.price +
            " " +
            dt.propose_id +
            " " +
            dt.send_to +
            " " +
            dt.status
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  const rowSelection: TableRowSelection<GetPropose> = {};
  return (
    <div className="">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-y-2">
        <div className="flex items-center gap-1">
          <Select
            defaultValue={pageLimit}
            style={{ width: 83 }}
            onChange={(e) => setPageLimit(e)}
            options={[
              { value: 10, label: 10 },
              { value: 25, label: 25 },
              { value: 50, label: 50 },
              { value: 100, label: 100 },
              { value: 500, label: 500 },
              { value: 1000, label: 1000 },
              { value: 100000000, label: "Tất cả" },
            ]}
          />
          <Dropdown className="ml-1" trigger={["click"]}>
            <Button>Xuất ra</Button>
          </Dropdown>
          <Button>
            <FaArrowsRotate />
          </Button>
        </div>
        <div className="flex items-center">
          <Search
            onChange={(e) => {
              handleSearchFilter(e.target.value);
            }}
            placeholder="Tìm kiếm"
            style={{ width: 200 }}
          />
        </div>
      </div>
      <div className="w-full overflow-auto">
        <div className="min-w-fit">
          <Table<GetPropose>
            columns={columns}
            // className="text-xs"
            rowSelection={rowSelection}
            dataSource={dataFilter}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: pageLimit, // Items per page
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
