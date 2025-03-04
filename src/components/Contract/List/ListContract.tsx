import { AppDispatch, RootState } from "@/redux/store/store";
import { Button, Modal, Select, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalUpdateContract from "../Tool/Modal/ModalUpdateContract/ModalUpdateContract";
import { IGetContract } from "@/models/contractInterface";
import contractService from "@/services/contractService.";
import { useDispatch } from "react-redux";
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
import usePostData from "@/hooks/usePostData";
import { MdDeleteForever } from "react-icons/md";
import { useParams, useSearchParams } from "next/navigation";
import ModalDocument from "../Tool/Modal/ModalDocument/ModalDocument";
import useCheckRole from "@/utils/CheckRole";

export default function ListContract() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole(["admin-top", "contract", "contract-edit"]);
  const { customerID } = useParams();
  const [pageLimit, setPageLimit] = useState<number>(25);
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_contracts
  );
  useEffect(() => {
    if (customerID) {
      dispatch(fetchContracts({ customer: customerID as string }));
    }
  }, [customerID]);
  const [dataFilter, setDataFilter] = useState<IGetContract[] | [] | undefined>(
    []
  );
  const columns: TableColumnsType<IGetContract> = [
    {
      title: "Mã hợp đồng",
      className: "text-xs",
      dataIndex: "code_contract",
      render: (value: string, record) => (
        <div className="flex flex-col gap-1 ">
          <strong>{`${value.slice(0, 10)}...`}</strong>
          <div className="flex gap-2">
            <Button type="text" ghost className="text-xs text-blue-600">
              Xem
            </Button>
            {isAuthorized && (
              <>
                <ModalUpdateContract ID={record.contract_id} />
                <ModalDocument ID={record.contract_id} />
              </>
            )}
          </div>
        </div>
      ),
      sorter: (a: IGetContract, b: IGetContract) =>
        a.contract_id.localeCompare(b.contract_id),
    },
    {
      title: "Tên hợp đồng",
      dataIndex: "name_contract",
      className: "text-xs",
      render: (value?: string) => value || "N/A",
      sorter: (a: IGetContract, b: IGetContract) =>
        (a.name_contract || "").localeCompare(b.name_contract || ""),
    },
    {
      title: "Khách hàng",
      dataIndex: ["customer", "name_company"],
      className: "text-xs",
      render: (value?: string) => value || "N/A",
      sorter: (a: IGetContract, b: IGetContract) =>
        (a.customer?.name_company || "").localeCompare(
          b.customer?.name_company || ""
        ),
    },
    {
      title: "Loại hợp đồng",
      dataIndex: ["type_contract", "name_type"],
      className: "text-xs",
      render: (value) => value || "N/A",
      sorter: (a: IGetContract, b: IGetContract) =>
        (a.type_contract?.name_type || "").localeCompare(
          b.type_contract?.name_type || ""
        ),
    },
    {
      title: "Giá trị hợp đồng",
      dataIndex: "price",
      className: "text-xs",
      render: (value?: number) =>
        value ? `${value.toLocaleString("vi-VN")}đ` : "N/A",
      sorter: (a: IGetContract, b: IGetContract) =>
        (a.price || 0) - (b.price || 0),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "date_start",
      className: "text-xs",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetContract, b: IGetContract) =>
        new Date(a.date_start || 0).getTime() -
        new Date(b.date_start || 0).getTime(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "date_expired",
      className: "text-xs",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetContract, b: IGetContract) =>
        new Date(a.date_expired || 0).getTime() -
        new Date(b.date_expired || 0).getTime(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      className: "text-xs",
      render: (value: "delete" | "active" | "hide") => (
        <span
          style={{
            color:
              value === "active" ? "green" : value === "hide" ? "gray" : "red",
          }}
        >
          {value === "delete" ? "Xóa" : value === "active" ? "Hoạt động" : "Ẩn"}
        </span>
      ),
      sorter: (a: IGetContract, b: IGetContract) =>
        (a.status || "").localeCompare(b.status || ""),
    },
  ];

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
            dt.project?.name +
            " " +
            dt.name_contract +
            " " +
            dt.contract_id +
            " " +
            dt.customer?.name_company +
            " " +
            dt.status
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };
  const { postdata } = usePostData();
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<IGetContract> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IGetContract[]) => {
      setListSelect(selectedRows.map((dt) => dt.contract_id));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      contractService.deleteContract(listSelect)
    );
    if (statusCode === 200) {
      dispatch(fetchContracts(null));
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
              handleSearchFilter(e.target.value);
            }}
            placeholder="Tìm kiếm"
            style={{ width: 200 }}
          />
        </div>
      </div>
      <div className="w-full overflow-auto">
        <div className="min-w-fit">
          <Table<IGetContract>
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
