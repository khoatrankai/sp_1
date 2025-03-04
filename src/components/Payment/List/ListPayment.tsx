import usePostData from "@/hooks/usePostData";
import { IGetPayment } from "@/models/contractInterface";
import { fetchPayments } from "@/redux/store/slices/contractSlices/payment.slide";
import { AppDispatch, RootState } from "@/redux/store/store";
import contractService from "@/services/contractService.";
import useCheckRole from "@/utils/CheckRole";
import { Button, Modal, Select, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function ListPayment() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const isAuthorized = useCheckRole([
    "admin-top",
    "payment",
    "payment-edit",
    "contract",
  ]);
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_payments
  );
  // const { datas: dataTypesProduct } = useSelector(
  //   (state: RootState) => state.type_product
  // );

  const [dataFilter, setDataFilter] = useState<IGetPayment[] | [] | undefined>(
    []
  );
  const handleSubmit = async (
    id: string,
    status: "success" | "fail" | "pending"
  ) => {
    const statusCode = await postdata(() =>
      contractService.updatePayment(id, { status })
    );
    if (statusCode === 200) {
      dispatch(fetchPayments({}));
    }
  };
  const columns: TableColumnsType<IGetPayment> = [
    {
      title: "#Mã thanh toán",
      dataIndex: ["payment_id"],
      className: "text-xs",
      render: (value: string, record) => (
        <div className="flex flex-col gap-1">
          <strong>#{value}</strong>
          <div className="flex gap-2 flex-wrap">
            {isAuthorized && (
              <>
                {record.status === "pending" && (
                  <>
                    <Button
                      type="dashed"
                      className="bg-green-400 text-white"
                      onClick={() => {
                        handleSubmit(value, "success");
                      }}
                    >
                      Đã thanh toán
                    </Button>
                    <Button
                      type="dashed"
                      className="bg-red-400 text-white"
                      onClick={() => {
                        handleSubmit(value, "fail");
                      }}
                    >
                      Hủy thanh toán
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ),
    },
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
      render: (value: "fail" | "pending" | "success", record?: IGetPayment) => (
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
            : new Date().getTime() <=
              new Date(record?.date_expired ?? "").getTime()
            ? "Đang chờ"
            : "Quá hạn"}
        </span>
      ),
      sorter: (a: IGetPayment, b: IGetPayment) =>
        (a.status || "").localeCompare(b.status || ""),
    },
  ];

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSources?.filter((dt) => {
        return String(
          dt?.contract?.name_contract +
            " " +
            dt?.price +
            " " +
            dt?.type_product?.name +
            " " +
            dt.created_at +
            " " +
            new Date(dt.date_expired ?? "").toLocaleDateString("vi-VN") +
            " " +
            dt.type_product +
            " " +
            dt.payment_id +
            " " +
            dt?.supplier?.name +
            " " +
            dt?.status
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<IGetPayment> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IGetPayment[]) => {
      setListSelect(selectedRows.map((dt) => dt.payment_id ?? ""));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      contractService.deletePayment(listSelect)
    );
    if (statusCode === 200) {
      dispatch(fetchPayments({}));
      setListSelect([]);
      setIsModalConfirmDelete(false);
    }
  };

  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get("id");
    if (dataSources && id) {
      handleSearchFilter(id);
    } else {
      setDataFilter(
        dataSources.map((dt, index) => {
          return { ...dt, key: index };
        })
      );
    }
  }, [dataSources, searchParams]);
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
          <Button hidden={!(listSelect.length > 0)}>Xuất ra</Button>
          <Button
            onClick={() => {
              setIsModalConfirmDelete(true);
            }}
            danger
            hidden={!(listSelect.length > 0)}
            className="text-xl"
            icon={<MdDeleteForever />}
          />
          <Modal
            open={isModalConfirmDelete}
            title={"Xóa dữ liệu"}
            onOk={handleDelete}
            onCancel={() => {
              setIsModalConfirmDelete(false);
            }}
          >
            Bạn có chắc chắn muốn xóa không ?
          </Modal>
        </div>
        <div className="flex items-center">
          <Search
            onChange={(e) => {
              console.log(e);
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
