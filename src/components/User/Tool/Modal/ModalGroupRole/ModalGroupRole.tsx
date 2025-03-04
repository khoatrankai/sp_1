import usePostData from "@/hooks/usePostData";
import { GetCategoryRole, RoleTypeUserDto } from "@/models/userInterface";
import { RootState } from "@/redux/store/store";
import userService from "@/services/userService";
import useCheckRole from "@/utils/CheckRole";
import { Button, Checkbox, Modal, Table, TableColumnsType } from "antd";
import React, { Ref, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  ID: string;
  refBtn?: Ref<HTMLButtonElement>;
  name?: string;
};

export default function ModalGroupRole({ ID, refBtn, name }: Props) {
  const { postdata } = usePostData();
  const [listRole, setListRole] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
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
    const statusCode = await postdata(() =>
      userService.updateGroupRole(ID, listRole)
    );
    if (statusCode === 200) {
      setIsModalVisible(false);
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const showModal = async () => {
    setIsModalVisible(true);
    fetchData();
  };
  const fetchData = async () => {
    if (ID && isAuthorized) {
      const res = await userService.getRoleByGroup(ID);
      if (res.statusCode === 200) {
        setListRole(res.data.map((dt: RoleTypeUserDto) => dt.role_type_id));
      }
    }
  };

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
    <>
      <Button
        hidden={refBtn ? true : false}
        className="  text-xs text-yellow-500 font-semibold"
        type="text"
        ref={refBtn}
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title={`Cập nhật quyền hạn phòng ban`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <p className="text-xl font-semibold p-2">Quyền hạn {name}</p>
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
        <div className="flex justify-end">
          <Button onClick={handleSaveRole} type="primary">
            Cập nhật
          </Button>
        </div>
      </Modal>
    </>
  );
}
