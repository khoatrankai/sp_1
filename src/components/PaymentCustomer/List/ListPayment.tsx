/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGetPayment } from "@/models/contractInterface";
import customerService from "@/services/roleCustomerService/customerService";
import { Select, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";

export default function ListPayment() {
  const [pageLimit, setPageLimit] = useState<number>(25);

  // const { datas: dataTypesProduct } = useSelector(
  //   (state: RootState) => state.type_product
  // );

  const [dataFilter, setDataFilter] = useState<IGetPayment[] | [] | undefined>(
    []
  );
  const [dataSources, setDataSource] = useState<IGetPayment[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res: any = customerService.getAllPaymentByToken();
      if (res.statusCode === 200) {
        setDataSource(res.data);
      }
    };
    fetchData();
  }, []);
  const columns: TableColumnsType<IGetPayment> = [
    {
      title: "Tên hợp đồng",
      dataIndex: ["contract", "name_contract"],
      className: "text-xs",
      render: (value?: string) => value || "N/A",
      sorter: (a: IGetPayment, b: IGetPayment) =>
        (a.contract?.name_contract || "").localeCompare(
          b.contract?.name_contract || ""
        ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: ["supplier", "name"],
      className: "text-xs",
      render: (value?: string) => value || "N/A",
      sorter: (a: IGetPayment, b: IGetPayment) =>
        (a.supplier?.name || "").localeCompare(b.supplier?.name || ""),
    },
    {
      title: "Giá trị",
      dataIndex: ["price"],
      className: "text-xs",
      render: (value?: number) =>
        value ? `${value.toLocaleString("vi-VN")}đ` : "N/A",
      sorter: (a: IGetPayment, b: IGetPayment) =>
        (a.price || 0) - (b.price || 0),
    },
    {
      title: "Chi phí/Dịch vụ",
      dataIndex: ["type_product", "name"],
      className: "text-xs",
      render: (value?: string) => value || "N/A",
      sorter: (a: IGetPayment, b: IGetPayment) =>
        (a.type_product?.name || "").localeCompare(b.type_product?.name || ""),
    },

    {
      title: "Ngày kết thúc",
      dataIndex: "date_expired",
      className: "text-xs",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetPayment, b: IGetPayment) =>
        new Date(a.date_expired || 0).getTime() -
        new Date(b.date_expired || 0).getTime(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      className: "text-xs",
      render: (value: "fail" | "pending" | "success") => (
        <span
          style={{
            color:
              value === "success"
                ? "green"
                : value === "pending"
                ? "gray"
                : "red",
          }}
        >
          {value === "fail"
            ? "Thất bại"
            : value === "success"
            ? "Thành công"
            : "Đang chờ"}
        </span>
      ),
      sorter: (a: IGetPayment, b: IGetPayment) =>
        (a.status || "").localeCompare(b.status || ""),
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
            dt.date_expired +
            " " +
            dt.type_product +
            " " +
            dt.payment_id +
            " " +
            dt.supplier.name +
            " " +
            dt.status
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

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
          <Table<IGetPayment>
            columns={columns}
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
