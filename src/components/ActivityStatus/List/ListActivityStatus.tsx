import { RootState } from "@/redux/store/store";
import { Button, Dropdown, Select, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { IGetActivityContainer } from "@/models/productInterface";
import ModalUpdateActivityStatus from "../Tool/Modal/ModalUpdateActivityStatus/ModalUpdateActivityStatus";
import useCheckRole from "@/utils/CheckRole";

export default function ListActivityStatus() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const isAuthorized = useCheckRole(["admin-top", "product", "product-edit"]);
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_activity_container
  );
  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );
  const [dataFilter, setDataFilter] = useState<
    IGetActivityContainer[] | [] | undefined
  >([]);
  const columns: TableColumnsType<IGetActivityContainer> = [
    {
      title: "#",
      className: "text-xs",
      dataIndex: "activity_container_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>#{index + 1}</strong>
          <div className="flex gap-2">
            {/* <Button type="text" ghost className="text-xs text-blue-600">
              Xem
            </Button> */}
            {isAuthorized && <ModalUpdateActivityStatus ID={value} />}
          </div>
        </div>
      ),
      sorter: (a: IGetActivityContainer, b: IGetActivityContainer) =>
        a.activity_container_id.localeCompare(b.activity_container_id),
    },

    {
      title: "Nhân viên thực hiện",
      dataIndex: "user",
      className: "text-xs",
      render: (value) => {
        const dataName = dataUsers?.find((dt) => dt.user_id === value);
        return (
          <>
            {(dataName?.first_name || "") + " " + (dataName?.last_name || "")}
          </>
        );
      },
      sorter: (a: IGetActivityContainer, b: IGetActivityContainer) =>
        (a.list_code.length || 0) - (b.list_code.length || 0),
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "",
      className: "text-xs",
      render: (value, record) => {
        return <>{record.list_code.length}</>;
      },
      sorter: (a: IGetActivityContainer, b: IGetActivityContainer) =>
        (a.list_code.length || 0) - (b.list_code.length || 0),
    },
    {
      title: "Tổng giá trị",
      dataIndex: "",
      className: "text-xs",
      render: (value, record) => (
        <>
          {record.list_code
            .reduce((preValue, currValue) => {
              console.log(record);
              return (currValue.price ?? 0) + preValue;
            }, 0)
            .toLocaleString("vi-VN")}
          đ
        </>
      ),
      sorter: (a: IGetActivityContainer, b: IGetActivityContainer) =>
        (a.list_code.reduce((preValue, currValue) => {
          return currValue.price ?? 0 + preValue;
        }, 0) || 0) -
        (b.list_code.reduce((preValue, currValue) => {
          return currValue.price ?? 0 + preValue;
        }, 0) || 0),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: ["created_at"],
      className: "text-xs",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetActivityContainer, b: IGetActivityContainer) =>
        (a.created_at.toString() || "").localeCompare(
          b.created_at.toString() || ""
        ),
    },
  ];
  useEffect(() => {
    setDataFilter(
      dataSources.map((dt, index) => {
        return { ...dt, key: index };
      })
    );
  }, [dataSources]);

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSources?.filter((dt) => {
        return String(
          dt.created_at +
            " " +
            dt.activity_container_id +
            " " +
            dt.list_code.length +
            " " +
            dt.list_code.reduce((preValue, currValue) => {
              return currValue.price ?? 0 + preValue;
            }, 0)
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  const rowSelection: TableRowSelection<IGetActivityContainer> = {};
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
          <Table<IGetActivityContainer>
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
