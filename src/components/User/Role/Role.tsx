import {
  GetCategoryRole,
  GetRoleUser,
  RoleTypeUserDto,
} from "@/models/userInterface";
import { RootState } from "@/redux/store/store";
import userService from "@/services/userService";
import useCheckRole from "@/utils/CheckRole";
import {
  Button,
  Checkbox,
  Divider,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import { Option } from "antd/es/mentions";
import React, { Ref, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ModalGroupUser from "../Tool/Modal/ModalGroupUser/ModalGroupUser";

type Props = {
  ID: string;
  group_user?: string;
  refBtn?: Ref<HTMLButtonElement>;
};

export default function RoleUser({ ID, refBtn, group_user }: Props) {
  const refBtnGroup = useRef<HTMLButtonElement>();
  const { datas: dataGroup } = useSelector(
    (state: RootState) => state.get_group_user
  );
  const [listRole, setListRole] = useState<string[]>([]);
  const isAuthorized = useCheckRole([
    "admin-top",
    "user",
    "user-edit",
    "user-read",
  ]);
  const { datas: dataCategoryRole } = useSelector(
    (state: RootState) => state.get_category_roles
  );
  const handleSaveRole = async () => {
    await userService.updateRoleUserFullByID(ID, listRole);
  };
  const handleFillRole = async (customer_id: string) => {
    const res = await userService.getRoleByGroup(customer_id);
    if (res.statusCode === 200) {
      setListRole(res.data.map((dt: RoleTypeUserDto) => dt.role_type_id));
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = isAuthorized
        ? await userService.getRoleUserFullByID(ID)
        : await userService.getRoleUserFullByUser();
      if (res.statusCode === 200) {
        setListRole(
          res.data.map((dt: GetRoleUser) => {
            return dt.role_type.role_type_id;
          })
        );
      }
    };
    if (ID) fetchData();
  }, [ID, isAuthorized]);
  const columns: TableColumnsType<GetCategoryRole> = [
    {
      title: "Danh mục",
      className: "text-xs",
      dataIndex: "name_category",
      render: (value: string) => (
        <div className="flex flex-col gap-1 ">
          <strong className="flex gap-2 items-center">{value}</strong>
        </div>
      ),
      sorter: (a: GetCategoryRole, b: GetCategoryRole) =>
        a.name_category.localeCompare(b.name_category),
    },
    {
      title: "Tính năng",
      className: "text-xs",
      dataIndex: "",
      render: (value, record) => (
        <div className="flex flex-col gap-1">
          <Checkbox.Group
            value={listRole}
            onChange={(e) => {
              if (e.length > 0) {
                setListRole((preValue) => {
                  const data = preValue.filter((dt) => {
                    return !record.role_type?.find(
                      (dtt) => dtt.role_type_id === dt
                    );
                  });
                  return [...data, ...e];
                });
              } else {
                setListRole((preValue) => {
                  const data = preValue.filter((dt) => {
                    return !record.role_type?.find(
                      (dtt) => dtt.role_type_id === dt
                    );
                  });
                  return data;
                });
              }
            }}
            options={record?.role_type?.map((dt) => {
              return { label: dt.name_role, value: dt.role_type_id };
            })}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          />
        </div>
      ),
    },
  ];
  return (
    <div>
      <Select
        placeholder="Chọn quyền phòng ban"
        showSearch
        defaultValue={group_user}
        onChange={(e) => {
          handleFillRole(e);
        }}
        filterOption={(input, option) => {
          const text = Array.isArray(option?.children)
            ? option.children.join("")
            : option?.children ?? "";
          return text.toLowerCase().includes(input.toLowerCase());
        }}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: "8px 0" }} />
            <Button
              type="link"
              onClick={() => {
                refBtnGroup.current?.click();
              }}
            >
              + Thêm tùy chọn mới
            </Button>
          </>
        )}
      >
        {dataGroup?.map((dt) => (
          <Option key={dt.group_id} value={dt.group_id}>
            {dt.name_group}
          </Option>
        ))}
      </Select>
      <p className="text-xl font-semibold p-2">Phân quyền</p>
      <div>
        <Table<GetCategoryRole>
          columns={columns}
          dataSource={dataCategoryRole ?? []}
          scroll={{ x: "max-content" }}
          pagination={{
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          showSorterTooltip={{ target: "sorter-icon" }}
        />
      </div>
      <Button
        hidden={refBtn ? true : false}
        ref={refBtn}
        onClick={handleSaveRole}
      />
      <ModalGroupUser refBtnGroup={refBtnGroup as Ref<HTMLButtonElement>} />
    </div>
  );
}
