"use client";
import React, { Ref, useState } from "react";
import { Button, Form, Input, Modal, Table } from "antd";
import usePostData from "@/hooks/usePostData";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import { IoIosAdd } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  ICreateGroupUser,
  IGetGroupUser,
  IUpdateGroupUser,
} from "@/models/userInterface";
import userService from "@/services/userService";
import { fetchGroupUser } from "@/redux/store/slices/userSlices/get_all_group.slice";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
import ModalGroupRole from "../ModalGroupRole/ModalGroupRole";
type Props = {
  refBtnGroup?: Ref<HTMLButtonElement>;
};

const ModalGroupUser = ({ refBtnGroup }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [indexEdit, setIndexEdit] = useState<number>(-1);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataGroupUser } = useSelector(
    (state: RootState) => state.get_group_user
  );

  const handlePushIndex = (index: number) => {
    setIndexEdit(index);
    formTypeEdit.setFieldsValue(dataGroupUser?.[index]);
  };

  // const [dataSource, setDataSource] = useState<ITypeProduct[] | []>([]);
  const [tabFormType, setTabFormType] = useState<boolean>(false);
  const { postdata } = usePostData();
  const [formType] = useForm();
  const [formTypeEdit] = useForm();

  // useEffect(() => {
  //   console.log(dataSource);
  // }, [dataSource]);
  const columns: ColumnsType<IGetGroupUser> = [
    {
      title: "Tên nhóm",
      dataIndex: "name_group",
      width: "50%",
      key: "name_group",
      render: (value, record, index) => {
        return (
          <>
            <strong className="flex gap-2 items-center">
              {value}

              <Button
                type="link"
                onClick={() => {
                  handlePushIndex(index);
                }}
                icon={<CiEdit />}
              />
            </strong>
          </>
        );
      },
    },
    {
      title: "Quyền hạn",
      dataIndex: "group_id",
      width: "30%",
      key: "group_id",
      render: (value, record) => {
        return (
          <>
            <ModalGroupRole ID={value} name={record.name_group} />
          </>
        );
      },
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: ICreateGroupUser) => {
    try {
      const statusCode = await postdata(() =>
        userService.createGroupUser(values)
      );

      if (statusCode === 201) {
        dispatch(fetchGroupUser());
        formType.resetFields();
        setTabFormType(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  const handleSubmitEdit = async (values: IUpdateGroupUser) => {
    try {
      const statusCode = await postdata(() =>
        userService.updateGroupUser(
          dataGroupUser?.[indexEdit ?? 0].group_id,
          values
        )
      );
      if (statusCode === 200) {
        dispatch(fetchGroupUser());
        dispatch(fetchUserInfo());
        setIndexEdit(-1);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  return (
    <>
      <Button
        hidden={refBtnGroup ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        onClick={showModal}
        ref={refBtnGroup}
      >
        Phòng ban
      </Button>
      <Modal
        title={
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span>Phòng ban</span>
            <Button
              className="text-white font-semibold bg-orange-500"
              icon={<IoIosAdd />}
              type="default"
              onClick={() => {
                formType.resetFields();
                setTabFormType(!tabFormType);
              }}
            />
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <div className="flex flex-col gap-2">
          <div
            className="bg-slate-200 px-1 py-2 rounded-md"
            hidden={!tabFormType}
          >
            <Form
              form={formType}
              onFinish={handleSubmit}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <Form.Item
                name="name_group"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhóm",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên nhóm" />
              </Form.Item>

              <Form.Item
                style={{
                  display: "flex",
                  justifyContent: "end",
                  margin: "0",
                }}
              >
                <Button
                  className="bg-green-500 text-white font-semibold"
                  onClick={() => {
                    formType.submit();
                  }}
                >
                  Thêm
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div
            className="bg-slate-200 px-1 py-2 rounded-md"
            hidden={!(indexEdit > -1)}
          >
            <Form
              form={formTypeEdit}
              onFinish={handleSubmitEdit}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <Form.Item
                name="name_group"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhóm",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên nhóm" />
              </Form.Item>

              <Form.Item
                style={{
                  display: "flex",
                  gap: "2px",
                  justifyContent: "end",
                  margin: "0",
                }}
              >
                <Button
                  className="bg-yellow-500 text-white font-semibold"
                  htmlType="submit"
                >
                  Cập nhật
                </Button>
                <Button
                  className="bg-red-500 text-white font-semibold"
                  onClick={() => {
                    setIndexEdit(-1);
                  }}
                >
                  Huỷ
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="border-t-2 w-full overflow-x-auto">
            <div className="w-full">
              <Table<IGetGroupUser>
                columns={columns}
                scroll={{ x: "max-content" }}
                className="custom-table"
                // rowSelection={rowSelection}
                dataSource={dataGroupUser}
                pagination={{
                  pageSize: 10,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
                showSorterTooltip={{ target: "sorter-icon" }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalGroupUser;
