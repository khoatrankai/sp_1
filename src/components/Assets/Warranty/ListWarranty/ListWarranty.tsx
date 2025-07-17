import usePostData from "@/hooks/usePostData";
import customerService from "@/services/customerService";
import { Button, Modal, Select, Table, TableColumnsType } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { GetWarranty } from "@/models/productInterface";
import { fetchWarranties } from "@/redux/store/slices/productSlices/get_all_warranty.slice";
import ModalUpdateWarranty from "../ToolWarranty/ModalWarranty/ModalUpdateWarranty";
import ModalReviewWarranty from "../ToolWarranty/ModalWarranty/ModalReviewWarranty";

type Props={
  idAsset?:string
}

export default function ListWarranty({idAsset}:Props) {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.get_warranties_by_asset
  );
  const [dataFilter, setDataFilter] = useState<
    GetWarranty[] | [] | undefined
  >();

  const { postdata } = usePostData();
  const columns: TableColumnsType<GetWarranty> = [
    {
      title: "#",
      className: "text-xs",
      dataIndex: "id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>#{index + 1}</strong>
          <div className="flex gap-2">
            {/* <Button
              type="text"
              ghost
              className="text-xs text-blue-600"
              onClick={() => {
                window.location.href = `/customers/info/${value}`;
              }}
            >
              Xem
            </Button> */}
            <ModalUpdateWarranty warranty_id={value} idAsset={idAsset} />
            <ModalReviewWarranty warranty_id={value} idAsset={idAsset} />
          </div>
        </div>
      ),
      sorter: (a: GetWarranty, b: GetWarranty) =>
        (a.id ?? "").localeCompare(b.id ?? ""),
    },
    {
      title: "Lý do",
      className: "text-xs",
      dataIndex: "reason",
      render: (value: string) => (
        <>{value?.length > 15 ? `${value.slice(0, 15)}...` : value}</>
      ),
      sorter: (a: GetWarranty, b: GetWarranty) =>
        (a.reason ?? "").localeCompare(b.reason ?? ""),
    },
    {
      title: "Giải quyết",
      className: "text-xs",
      dataIndex: ["solve"],
      render: (value: string) => (
        <>{value?.length > 15 ? `${value.slice(0, 15)}...` : value}</>
      ),
      sorter: (a: GetWarranty, b: GetWarranty) =>
        (a.solve ?? "").localeCompare(b.solve ?? ""),
    },
    {
  title: "Trạng thái",
  className: "text-xs",
  dataIndex: "status",
  render: (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'in_progress':
        return 'Đang xử lý';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  },
  sorter: (a: GetWarranty, b: GetWarranty) => {
    const getLabel = (status: string) => {
      switch (status) {
        case 'pending':
          return 'Chờ xử lý';
        case 'in_progress':
          return 'Đang xử lý';
        case 'completed':
          return 'Đã hoàn thành';
        case 'cancelled':
          return 'Đã hủy';
        default:
          return status;
      }
    };
    return getLabel(a.status).localeCompare(getLabel(b.status));
  }
}
,
    {
      title: "Đánh giá",
      className: "text-xs",
      dataIndex: "review",
      sorter: (a: GetWarranty, b: GetWarranty) =>
        (a.review ?? "").localeCompare(b.review ?? ""),
    },
    {
          title: "Bắt đầu",
          dataIndex: "date_start",
          className: "text-xs",
          render: (value?: Date) =>
            value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
          sorter: (a: GetWarranty, b: GetWarranty) =>
            new Date(a.date_start || 0).getTime() -
            new Date(b.date_start || 0).getTime(),
        },
         {
          title: "Kết thúc",
          dataIndex: "date_end",
          className: "text-xs",
          render: (value?: Date) =>
            value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
          sorter: (a: GetWarranty, b: GetWarranty) =>
            new Date(a.date_end || 0).getTime() -
            new Date(b.date_end || 0).getTime(),
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
      dataSource?.filter((dt) => {
        return String(
          dt.id +
            " " +
            dt.note +
            " " +
            dt.review +
            " " +
            dt?.reason +
            " " +
            dt?.solve
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<GetWarranty> = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: GetWarranty[]
    ) => {
      setListSelect(selectedRows.map((dt) => dt.id));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      customerService.deleteInfoCustomer(listSelect)
    );
    if (statusCode === 200) {
      dispatch(fetchWarranties(idAsset ?? ""));
     
      setListSelect([]);
      setIsModalConfirmDelete(false);
    }
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
        </div>
        <div className="flex gap-2 items-center">
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
          <Table<GetWarranty>
            columns={columns}
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
  );
}
