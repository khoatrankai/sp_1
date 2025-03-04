import usePostData from "@/hooks/usePostData";
import { CustomerInfo } from "@/models/customerInterface";
import customerService from "@/services/customerService";
import {
  Button,
  Modal,
  Select,
  Switch,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import ModalUpdateCustomer from "../ToolCustomer/ModalCustomer/ModalUpdateCustomer";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchCustomerAbout } from "@/redux/store/slices/customerSlices/about_customer.slice";
import { MdDeleteForever } from "react-icons/md";
import { fetchCustomerFilter } from "@/redux/store/slices/customerSlices/get_filter_customer.slice";
import useCheckRole from "@/utils/CheckRole";
import { useSearchParams } from "next/navigation";

export default function ListCustomer() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const isAuthorized = useCheckRole(["admin-top", "customer", "customer-edit"]);
  const [filterData, setFilterData] = useState<string>("");
  const [itemGroup, setItemGroup] = useState<
    { value: string; label: string }[]
  >([]);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.get_filter_customer
  );
  const [dataFilter, setDataFilter] = useState<
    CustomerInfo[] | [] | undefined
  >();
  const { datas: dataGroup } = useSelector(
    (state: RootState) => state.get_group_customer
  );
  useEffect(() => {
    if (filterData !== "") {
      dispatch(
        fetchCustomerFilter({
          group: filterData === "all" ? undefined : filterData,
        })
      );
    }
  }, [filterData]);
  useEffect(() => {
    if (dataGroup) {
      const customData =
        dataGroup.map((dt) => {
          return { value: dt.group_id, label: dt.name_group ?? "" };
        }) ?? [];
      setItemGroup([...customData, { label: "Tất cả", value: "all" }]);
    }
  }, [dataGroup]);
  const { postdata } = usePostData();
  const columns: TableColumnsType<CustomerInfo> = [
    {
      title: "#",
      className: "text-xs",
      dataIndex: "info_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>
            #{index + 1}.{`${value.slice(0, 10)}...`}
          </strong>
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
            {isAuthorized && <ModalUpdateCustomer info_id={value} />}
          </div>
        </div>
      ),
      sorter: (a: CustomerInfo, b: CustomerInfo) =>
        a.info_id.localeCompare(b.info_id),
    },
    {
      title: "Tên khách hàng",
      className: "text-xs",
      dataIndex: "name_company",
      render: (value: string) => (
        <>{value.length > 15 ? `${value.slice(0, 15)}...` : value}</>
      ),
      sorter: (a: CustomerInfo, b: CustomerInfo) =>
        a.name_company.localeCompare(b.name_company),
    },
    {
      title: "Liên hệ chính",
      className: "text-xs",
      dataIndex: ["infoContacts", "0", "customer", "full_name"],
      render: (value: string) => (
        <>{value?.length > 15 ? `${value.slice(0, 15)}...` : value}</>
      ),
      sorter: (a: CustomerInfo, b: CustomerInfo) =>
        a.infoContacts[0].customer.full_name.localeCompare(
          b.infoContacts[0].customer.full_name
        ),
    },
    {
      title: "Email liên hệ",
      className: "text-xs",
      dataIndex: ["infoContacts", "0", "customer", "email"],

      sorter: (a: CustomerInfo, b: CustomerInfo) =>
        a.infoContacts[0].customer.email.localeCompare(
          b.infoContacts[0].customer.email
        ),
    },
    {
      title: "Điện thoại",
      className: "text-xs",
      dataIndex: "phone_number",
      sorter: (a: CustomerInfo, b: CustomerInfo) =>
        a.phone_number.localeCompare(b.phone_number),
    },
    {
      title: "Đang hoạt động",
      className: "text-xs",
      dataIndex: "status_active",
      render: (value, record) => (
        <>
          <Switch
            defaultChecked={value === "active"}
            onChange={async (check) => {
              const statusCode = await postdata(() =>
                customerService.updateStatusCustomer({
                  info_id: record.info_id,
                  status_active: check ? "active" : "inactive",
                })
              );
              if (statusCode === 200) {
                dispatch(
                  fetchCustomerFilter({
                    group: filterData === "" ? undefined : filterData,
                  })
                );
                dispatch(fetchCustomerAbout());
              }
            }}
          />
        </>
      ),
    },
    {
      title: "Nhóm khách hàng",
      className: "text-xs",
      dataIndex: ["group_customer", "name_group"],
      sorter: (a: CustomerInfo, b: CustomerInfo) =>
        a.group_customer.name_group.localeCompare(b.group_customer.name_group),
      render: (value: string) => (
        <>
          <Tag color={"gray"}>{value}</Tag>
        </>
      ),
    },
    {
      title: "Ngày tạo",
      className: "text-xs",
      dataIndex: "created_at",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: CustomerInfo, b: CustomerInfo) =>
        a.created_at.localeCompare(b.created_at),
    },
  ];

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSource?.filter((dt) => {
        return String(
          dt.info_id +
            " " +
            dt.created_at +
            " " +
            dt.name_company +
            " " +
            dt?.infoContacts?.[0]?.customer?.full_name +
            " " +
            dt?.infoContacts?.[0]?.customer?.email +
            " " +
            dt.phone_number
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      }) ?? []
    );
  };
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<CustomerInfo> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: CustomerInfo[]) => {
      setListSelect(selectedRows.map((dt) => dt.info_id));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      customerService.deleteInfoCustomer(listSelect)
    );
    if (statusCode === 200) {
      dispatch(
        fetchCustomerFilter({
          group: filterData === "" ? undefined : filterData,
        })
      );
      dispatch(fetchCustomerAbout());
      setListSelect([]);
      setIsModalConfirmDelete(false);
    }
  };
  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get("id");
    if (dataSource && id) {
      handleSearchFilter(id);
    } else {
      setDataFilter(
        dataSource.map((dt, index) => {
          return { ...dt, key: index };
        }) ?? []
      );
    }
  }, [dataSource, searchParams]);
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
          <Select
            placeholder="Nhóm khách hàng"
            style={{ minWidth: 120, flex: "1 1 0%" }}
            onChange={(e) => {
              // setFilterData({ ...filterData, project: e });
              setFilterData(e);
            }}
            showSearch
            allowClear
            filterOption={(input, option) => {
              const text = Array.isArray(option?.label)
                ? option.label.join("")
                : option?.label ?? "";
              return text.toLowerCase().includes(input.toLowerCase());
            }}
            options={itemGroup}
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
          <Table<CustomerInfo>
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
