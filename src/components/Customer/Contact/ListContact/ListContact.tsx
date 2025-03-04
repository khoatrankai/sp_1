import usePostData from "@/hooks/usePostData";
import customerService from "@/services/customerService";
import { Button, Modal, Select, Switch, Table, TableColumnsType } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchCustomerAbout } from "@/redux/store/slices/customerSlices/about_customer.slice";
import { MdDeleteForever } from "react-icons/md";
import { IAccountCustomers } from "@/models/customerInterface";
import ModalUpdateContact from "../ToolContact/ModalContact/ModalUpdateContact";
import { fetchCustomerAccounts } from "@/redux/store/slices/customerSlices/get_all_account.slice";
import { useParams } from "next/navigation";
import Search from "antd/es/input/Search";

export default function ListContact() {
  const { customerID } = useParams();
  const [pageLimit, setPageLimit] = useState<number>(25);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.get_account_customers
  );
  useEffect(() => {
    if (customerID) {
      dispatch(fetchCustomerAccounts({ customer_info: customerID as string }));
    }
  }, [customerID]);
  const [dataFilter, setDataFilter] = useState<
    IAccountCustomers[] | [] | undefined
  >();

  const { postdata } = usePostData();
  const columns: TableColumnsType<IAccountCustomers> = [
    {
      title: "#",
      className: "text-xs",
      dataIndex: "customer_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>#{index + 1}</strong>
          <div className="flex gap-2">
            <Button
              type="text"
              ghost
              className="text-xs text-blue-600"
              onClick={() => {
                window.location.href = `/admin/customer/info/${value}`;
              }}
            >
              Xem
            </Button>
            <ModalUpdateContact customer_id={value} />
          </div>
        </div>
      ),
      sorter: (a: IAccountCustomers, b: IAccountCustomers) =>
        (a.customer_id ?? "").localeCompare(b.customer_id ?? ""),
    },
    {
      title: "Tên khách hàng",
      className: "text-xs",
      dataIndex: "full_name",
      render: (value: string) => (
        <>{value?.length > 15 ? `${value.slice(0, 15)}...` : value}</>
      ),
      sorter: (a: IAccountCustomers, b: IAccountCustomers) =>
        (a.full_name ?? "").localeCompare(b.full_name ?? ""),
    },
    {
      title: "Email",
      className: "text-xs",
      dataIndex: ["email"],
      render: (value: string) => (
        <>{value?.length > 15 ? `${value.slice(0, 15)}...` : value}</>
      ),
      sorter: (a: IAccountCustomers, b: IAccountCustomers) =>
        a.email.localeCompare(b.email),
    },
    {
      title: "Chức vụ",
      className: "text-xs",
      dataIndex: ["position"],

      sorter: (a: IAccountCustomers, b: IAccountCustomers) =>
        a.position.localeCompare(b.position),
    },
    {
      title: "Điện thoại",
      className: "text-xs",
      dataIndex: "phone_number",
      sorter: (a: IAccountCustomers, b: IAccountCustomers) =>
        a.phone_number.localeCompare(b.phone_number),
    },
    {
      title: "Đang hoạt động",
      className: "text-xs",
      dataIndex: "status",
      render: (value, record) => (
        <>
          <Switch
            defaultChecked={value === "active"}
            onChange={async (check) => {
              const dataForm = new FormData();
              dataForm.append("status", check ? "active" : "hide");
              const statusCode = await postdata(() =>
                customerService.updateAccountCustomer(
                  record.customer_id,
                  dataForm
                )
              );
              if (statusCode === 200) {
                dispatch(
                  fetchCustomerAccounts({ customer_info: customerID as string })
                );
                dispatch(fetchCustomerAbout());
              }
            }}
          />
        </>
      ),
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
          dt.customer_id +
            " " +
            dt.email +
            " " +
            dt.phone_number +
            " " +
            dt?.position +
            " " +
            dt?.full_name
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<IAccountCustomers> = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: IAccountCustomers[]
    ) => {
      setListSelect(selectedRows.map((dt) => dt.customer_id));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      customerService.deleteInfoCustomer(listSelect)
    );
    if (statusCode === 200) {
      dispatch(fetchCustomerAccounts({ customer_info: customerID as string }));
      dispatch(fetchCustomerAbout());
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
          <Table<IAccountCustomers>
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
