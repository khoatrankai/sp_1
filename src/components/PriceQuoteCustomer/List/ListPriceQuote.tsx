/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
// import useFetchData from "@/hooks/useFetchData";
import { IGetPriceQuote } from "@/models/priceQuoteInterface";
// import { Vat } from "@/models/systemInterface";
// import systemService from "@/services/systemService";
import { Select, Table, TableColumnsType, Tag } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import customerService from "@/services/roleCustomerService/customerService";

export default function ListPropose() {
  // const { data: dataVats } = useFetchData<Vat[]>(systemService.getVats);

  const [pageLimit, setPageLimit] = useState<number>(25);
  const [dataFilter, setDataFilter] = useState<
    IGetPriceQuote[] | [] | undefined
  >([]);
  const [dataSources, setDataSource] = useState<IGetPriceQuote[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res: any = customerService.getAllPriceQuoteByToken();
      if (res.statusCode === 200) {
        setDataSource(res.data);
      }
    };
    fetchData();
  }, []);
  const columns: TableColumnsType<IGetPriceQuote> = [
    {
      title: "Báo giá#",
      className: "text-xs",
      dataIndex: "price_quote_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>
            #{index + 1}.{`${value.slice(0, 10)}...`}
          </strong>
        </div>
      ),
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        a.price_quote_id.localeCompare(b.price_quote_id),
    },

    {
      title: "Dự án",
      className: "text-xs",
      dataIndex: ["project", "name"],
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        (a.project.name ?? "").localeCompare(b.project.name ?? ""),
      render: (value) => {
        return `${value}`;
      },
    },
    {
      title: "Ngày báo giá",
      className: "text-xs",
      dataIndex: "date_start",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        a.date_start.toString().localeCompare(b.date_start.toString()),
    },
    {
      title: "Ngày hết hạn",
      className: "text-xs",
      dataIndex: "date_expired",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        a.date_expired.toString().localeCompare(b.date_expired.toString()),
    },
    {
      title: "Mã tham chiếu",
      className: "text-xs",
      dataIndex: "reference_code",
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        a.reference_code.localeCompare(b.reference_code),
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
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        a.status.localeCompare(b.status),
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
            dt.date_start +
            " " +
            dt.project.name +
            " " +
            dt.price_quote_id +
            " " +
            dt.user_support.last_name +
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
          <Table<IGetPriceQuote>
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
