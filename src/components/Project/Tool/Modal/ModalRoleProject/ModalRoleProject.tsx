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
import projectService from "@/services/projectService";
import { fetchProjectRoles } from "@/redux/store/slices/projectSlices/get_role.slice";
import { IRoleProject } from "@/models/projectInterface";
import { fetchProjects } from "@/redux/store/slices/projectSlices/get_all_project.slice";
type Props = {
  refBtnRole?: Ref<HTMLButtonElement>;
};
const ModalRoleProject = ({ refBtnRole }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [indexEdit, setIndexEdit] = useState<number>(-1);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataRoles } = useSelector(
    (state: RootState) => state.role_projects
  );

  const handlePushIndex = (index: number) => {
    setIndexEdit(index);
    formTypeEdit.setFieldsValue(dataRoles?.[index]);
  };

  // const [dataSource, setDataSource] = useState<ITypeProduct[] | []>([]);
  const [tabFormType, setTabFormType] = useState<boolean>(false);
  const { postdata } = usePostData();
  const [formType] = useForm();
  const [formTypeEdit] = useForm();

  // useEffect(() => {
  //   console.log(dataSource);
  // }, [dataSource]);
  const [idGroupDelete, setIdGroupDelete] = useState<string>("");
        const handleDelete = async () => {
                const statusCode = await postdata(() =>
                  projectService.deleteRole([idGroupDelete??""])
                );
                if (statusCode === 200) {
                  dispatch(fetchProjectRoles());
                  setIdGroupDelete("");
                }
              };
  const columns: ColumnsType<IRoleProject> = [
    {
      title: "Tag loại",
      dataIndex: "name_tag",
      width: "20%",
      key: "name_tag",
      render: (value) => {
        return (
          <>
            <strong className="flex gap-2 items-center">{value}</strong>
          </>
        );
      },
    },
    {
      title: "Tên loại",
      dataIndex: "name",
      width: "40%",
      key: "name",
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
              <Button
                                                className="  text-xs text-red-500 font-semibold"
                                                type="text"
                              
                                                onClick={()=>setIdGroupDelete(record?.role_id ?? "")}
                                              >
                                                Xóa
                                              </Button>
            </strong>
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

  const handleSubmit = async (values: IRoleProject) => {
    console.log(values);
    try {
      const statusCode = await postdata(() =>
        projectService.createRole(values)
      );

      if (statusCode === 201) {
        dispatch(fetchProjectRoles());
        formType.resetFields();
        setTabFormType(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  const handleSubmitEdit = async (values: IRoleProject) => {
    try {
      const statusCode = await postdata(() =>
        projectService.updateRole(
          dataRoles?.[indexEdit ?? 0].role_id ?? "",
          values
        )
      );
      if (statusCode === 200) {
        dispatch(fetchProjectRoles());
        dispatch(fetchProjects());
        setIndexEdit(-1);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  return (
    <>
      <Button
        hidden={refBtnRole ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        onClick={showModal}
        ref={refBtnRole}
      >
        Vị trí dự án
      </Button>
      <Modal
        title={
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span>Vị trí dự án</span>
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
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên loại" />
              </Form.Item>
              <Form.Item
                name="name_tag"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tag loại",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tag loại" />
              </Form.Item>
              <Form.Item
                style={{
                  display: "flex",
                  minWidth: "100%",
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
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên loại" />
              </Form.Item>
              <Form.Item
                name="name_tag"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tag loại",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tag loại" />
              </Form.Item>
              <Form.Item
                style={{
                  display: "flex",
                  minWidth: "100%",
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
              <Table<IRoleProject>
                columns={columns}
                scroll={{ x: "max-content" }}
                className="custom-table"
                // rowSelection={rowSelection}
                dataSource={dataRoles}
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
      <Modal
                                      open={!(idGroupDelete === "")}
                                      title={"Xóa dữ liệu"}
                                      onOk={handleDelete}
                                      onCancel={() => {
                                        setIdGroupDelete("");
                                      }}
                                    >
                                      Bạn có chắc chắn muốn xóa không ?
                                    </Modal>
    </>
  );
};

export default ModalRoleProject;
