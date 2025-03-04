import { AppDispatch, RootState } from "@/redux/store/store";
import {
  Avatar,
  Button,
  Modal,
  Select,
  Switch,
  Table,
  TableColumnsType,
} from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalUpdatePriceQuote from "../Tool/Modal/ModalUpdateUser/ModalUpdateUser";
import { InfoUser } from "@/models/userInterface";
import usePostData from "@/hooks/usePostData";
import { useDispatch } from "react-redux";
import userService from "@/services/userService";
import { MdDeleteForever } from "react-icons/md";
import CustomFormData from "@/utils/CustomFormData";
import { fetchUserFilter } from "@/redux/store/slices/userSlices/get_filter_user.slice";
import useCheckRole from "@/utils/CheckRole";
import { useSearchParams } from "next/navigation";

export default function ListUser() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const [filterData, setFilterData] = useState<string>("");
  const isAuthorized = useCheckRole(["admin-top", "user", "user-edit"]);
  const [itemGroup, setItemGroup] = useState<
    { value: string; label: string }[]
  >([]);
  const { datas: dataGroup } = useSelector(
    (state: RootState) => state.get_group_user
  );
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_filter_user
  );
  const [dataFilter, setDataFilter] = useState<InfoUser[] | [] | undefined>([]);

  const handleChangeStatus = async (id: string, status: boolean) => {
    const formdata = CustomFormData({ status: status ? "active" : "hide" });
    const res = await postdata(() => userService.updateUser(id, formdata));

    if (res === 200 || res === 201) {
      dispatch(
        fetchUserFilter({ group: filterData === "" ? undefined : filterData })
      );
    }
  };
  const columns: TableColumnsType<InfoUser> = [
    {
      title: "#",
      className: "text-xs",
      dataIndex: "user_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong className="flex gap-2 items-center">
            <span>
              <Avatar alt={red.last_name} src={red.picture_url} />
            </span>
            #{index + 1}.{`${value.slice(0, 10)}...`}
          </strong>
          <div className="flex gap-2">
            {isAuthorized && <ModalUpdatePriceQuote ID={value} />}
          </div>
        </div>
      ),
      sorter: (a: InfoUser, b: InfoUser) => a.user_id.localeCompare(b.user_id),
    },
    {
      title: "Họ và tên",
      className: "text-xs",
      dataIndex: "",
      render: (value, record) => (
        <>
          {record.first_name} {record.last_name}
        </>
      ),
      sorter: (a: InfoUser, b: InfoUser) =>
        (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name),
    },
    {
      title: "Email",
      className: "text-xs",
      dataIndex: "email",
      render: (value) => <>{value}</>,
      sorter: (a: InfoUser, b: InfoUser) => a.email.localeCompare(b.email),
    },
    {
      title: "Số điện thoại",
      className: "text-xs",
      dataIndex: "phone_number",
      render: (value) => <>{value}</>,
      sorter: (a: InfoUser, b: InfoUser) =>
        a.phone_number.localeCompare(b.phone_number),
    },
    {
      title: "Trạng thái",
      className: "text-xs",
      dataIndex: "status",
      render: (value: string, record) => (
        <>
          <Switch
            defaultChecked={value === "active"}
            onChange={async (e) => {
              handleChangeStatus(record.user_id, e);
              // const statusCode = await postdata(() =>
              //   productService.updateStatusProduct(
              //     record.product_id,
              //     check ? "active" : "hide"
              //   )
              // );
              // if (statusCode === 200) {
              //   dispatch(fetchProductAbout());
              // }
            }}
          />
        </>
      ),
      sorter: (a: InfoUser, b: InfoUser) => a.status.localeCompare(b.status),
    },
  ];
  useEffect(() => {
    if (dataGroup) {
      const customData =
        dataGroup.map((dt) => {
          return { value: dt.group_id, label: dt.name_group ?? "" };
        }) ?? [];
      setItemGroup([...customData, { label: "Tất cả", value: "all" }]);
    }
  }, [dataGroup]);
  useEffect(() => {
    if (filterData !== "") {
      dispatch(
        fetchUserFilter({
          group: filterData === "all" ? undefined : filterData,
        })
      );
    }
  }, [filterData]);

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSources?.filter((dt) => {
        return String(
          dt.first_name +
            " " +
            dt.last_name +
            " " +
            dt.email +
            " " +
            dt.phone_number +
            dt.status +
            " " +
            dt.user_id
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
  const rowSelection: TableRowSelection<InfoUser> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: InfoUser[]) => {
      setListSelect(selectedRows.map((dt) => dt.user_id));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() => userService.deleteUser(listSelect));
    if (statusCode === 200) {
      dispatch(
        fetchUserFilter({ group: filterData === "" ? undefined : filterData })
      );
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
        <div className="flex gap-2 items-center">
          <Select
            placeholder="Phòng ban"
            style={{ minWidth: 120, flex: "1 1 0%" }}
            onChange={(e) => {
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
          <Table<InfoUser>
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
