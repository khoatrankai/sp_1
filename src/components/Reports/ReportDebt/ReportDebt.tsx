import {
  Button,
  Dropdown,
  MenuProps,
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
import { fetchPayments } from "@/redux/store/slices/contractSlices/payment.slide";
import { MdKeyboardArrowDown } from "react-icons/md";
import exportToExcel from "./Export/Excel";
import { FaRegFileExcel } from "react-icons/fa";
export default function ReportDebt() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.get_payments
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
      return {
        date_expired: new Date(dt.date_expired ?? "").toLocaleDateString(
          "vi-VN"
        ),
        payment_id: dt.payment_id,
        name_supplier: dt.supplier?.name,
        type_product: dt.type_product.name,
        description: dt.description,
        price: (dt.price ?? 0).toLocaleString("vi-VN") + " ₫",
      };
    });
    exportToExcel(customeData);
  };
  const columns: TableColumnsType<IGetPayment> = [
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
      title: "Tên nhà cung cấp",
      dataIndex: ["supplier", "name"],
      key: "name",
    },
    {
      title: "Hết hạn",
      dataIndex: ["date_expired"],
      key: "date_expired",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Sản phẩm dịch vụ",
      dataIndex: ["type_product", "name"],
      key: "code_contract",
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "Công nơ",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString("vi-VN") + " ₫",
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
        type: "import",
        status: "pending",
      })
    );
  }, []);
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
            dt?.supplier?.name
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
