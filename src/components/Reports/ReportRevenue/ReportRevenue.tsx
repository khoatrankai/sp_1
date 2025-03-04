import {
  Button,
  DatePicker,
  Dropdown,
  MenuProps,
  Radio,
  Select,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { IGetPayment } from "@/models/contractInterface";
import dayjs from "dayjs";
import moment from "moment";
import { fetchPayments } from "@/redux/store/slices/contractSlices/payment.slide";
import { FaRegFileExcel } from "react-icons/fa";
import exportToExcel from "./Export/Excel";
import { MdKeyboardArrowDown } from "react-icons/md";
export default function ReportRevenue() {
  const [timeFirst, setTimeFirst] = useState<number | undefined>(
    new Date("2024-12-01").getTime()
  );
  const [timeEnd, setTimeEnd] = useState<number | undefined>(
    new Date("2024-12-31").getTime()
  );
  const [pageLimit, setPageLimit] = useState<number>(25);
  const [typeTime, setTypeTime] = useState<"quarter" | "month" | "year">(
    "year"
  );
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.get_payments
  );

  const { datas: dataVat } = useSelector(
    (state: RootState) => state.vat_system
  );

  const [dataFilter, setDataFilter] = useState<
    IGetPayment[] | [] | undefined
  >();
  const items: MenuProps["items"] = [
    {
      label: "Excel",
      key: "excel",
      icon: <FaRegFileExcel />,
    },
  ];
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "excel") {
      ExportExcel();
    }
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const ExportExcel = () => {
    const customeData = dataFilter?.map((dt) => {
      const priceVat =
        ((dataVat.find((dtt) => dtt.vat_id === dt.vat)?.type_vat ?? 0) / 100) *
          (dt.price ?? 0) +
        (dt.price ?? 0);
      return {
        date: dt.date,
        created_at: dt.created_at,
        contract: dt.contract?.name_contract,
        type: dt.contract?.project?.type?.name_type,
        name_contract: dt.contract?.project?.name,
        code_contract: dt.contract?.code_contract,
        type_product: dt.type_product.name,
        revenue: (dt.price ?? 0).toLocaleString("vi-VN") + " ₫",
        description: dt.description,
        revenue_vat: priceVat.toLocaleString("vi-VN") + " ₫",
      };
    });
    exportToExcel(
      typeTime,
      customeData,
      new Date(timeFirst ?? "").toLocaleDateString("vi-VN"),
      new Date(timeEnd ?? "").toLocaleDateString("vi-VN")
    );
  };
  const columns: TableColumnsType<IGetPayment> = [
    {
      title:
        typeTime === "month"
          ? "Tháng/Năm"
          : typeTime === "quarter"
          ? "Quý/Năm"
          : "Năm",
      dataIndex: ["date"],
      key: "date",
      render: (value, record, index) => {
        if (dataFilter?.[index - 1]?.date === value) {
          return;
        } else {
          return value;
        }
      },
    },
    {
      title: "Thời gian",
      dataIndex: ["created_at"],
      key: "created_at",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Mã thanh toán",
      dataIndex: "payment_id",
      key: "payment_id",
    },
    {
      title: "Mã hợp đồng",
      dataIndex: ["contract", "name_contract"],
      key: "name_contract",
    },
    {
      title: "Loại công trình",
      dataIndex: ["contract", "project", "type", "name_type"],
      key: "name_type",
    },
    {
      title: "Tên công trình",
      dataIndex: ["contract", "project", "name"],
      key: "name",
    },
    {
      title: "Số chứng từ",
      dataIndex: ["contract", "code_contract"],
      key: "code_contract",
    },
    {
      title: "Sản phẩm dịch vụ",
      dataIndex: ["type_product", "name"],
      key: "code_contract",
    },
    {
      title: "Doanh thu(trước thuế)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString("vi-VN") + " ₫",
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Doanh thu(sau thuế)",
      dataIndex: "price",
      key: "price-vat",
      render: (price: number, record) => {
        const priceVat =
          ((dataVat.find((dt) => dt.vat_id === record.vat)?.type_vat ?? 0) /
            100) *
            price +
          price;
        return priceVat.toLocaleString("vi-VN") + " ₫";
      },
    },
  ];
  useEffect(() => {
    setDataFilter(
      dataSource.map((dt, index) => {
        return { ...dt, key: index };
      })
    );
  }, [dataSource]);

  useEffect(() => {
    dispatch(
      fetchPayments({
        date_start: timeFirst ? timeFirst.toString() : undefined,
        date_end: timeEnd ? timeEnd.toString() : undefined,
        typeDate: typeTime,
        type: "export",
        status: "success",
        export: true,
      })
    );
  }, [timeFirst, timeEnd, typeTime]);
  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSource?.filter((dt) => {
        return String(
          dt.payment_id +
            " " +
            dt.created_at +
            " " +
            dt.description +
            " " +
            dt?.contract?.name_contract +
            " " +
            dt?.date
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-y-2">
        <div className="flex items-center gap-1 flex-wrap">
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
          <Dropdown menu={menuProps}>
            <Button>
              <Space>Xuất ra</Space>
              <MdKeyboardArrowDown />
            </Button>
          </Dropdown>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <div>
            <Radio.Group
              value={typeTime}
              buttonStyle="solid"
              onChange={(e) => {
                setTypeTime(e.target.value);
              }}
            >
              <Radio.Button value="month">Tháng</Radio.Button>
              <Radio.Button value="quarter">Quý</Radio.Button>
              <Radio.Button value="year">Năm</Radio.Button>
            </Radio.Group>
          </div>
          <RangePicker
            className="sm:w-auto w-full"
            picker={typeTime}
            value={[
              timeFirst ? dayjs(timeFirst) : undefined,
              timeEnd ? dayjs(timeEnd) : undefined,
            ]}
            onChange={(e, values) => {
              if (values[0] === "" || values[1] === "") {
                setTimeEnd(undefined);
                setTimeFirst(undefined);
              } else {
                if (typeTime === "year") {
                  setTimeFirst(new Date(values[0]).getTime());
                  setTimeEnd(new Date(`${values[1]}-12-31`).getTime());
                }
                if (typeTime === "month") {
                  setTimeFirst(new Date(`${values[0]}-01`).getTime());
                  setTimeEnd(
                    new Date(
                      `${moment(
                        new Date(
                          `${e?.[1]?.year()}-${(e?.[1]?.month() ?? 0) + 2}-01`
                        )
                      )
                        .clone()
                        .subtract(1, "days")}`
                    ).getTime()
                  );
                }
                if (typeTime === "quarter") {
                  if (values[0] !== "") {
                    const dataStart = values[0].replace("Q", "").split("-");
                    const dataEnd = values[1].replace("Q", "").split("-");
                    const startQuarter = new Date(
                      Number(dataStart[0]),
                      (Number(dataStart[1]) - 1) * 3,
                      1
                    );
                    const endQuarter = new Date(
                      Number(dataEnd[0]),
                      (Number(dataEnd[1]) - 1) * 3 + 3,
                      0,
                      23,
                      59,
                      59,
                      59
                    );
                    setTimeFirst(startQuarter.getTime());
                    setTimeEnd(endQuarter.getTime());
                  }
                }
              }
            }}
            // value={}
          />
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
