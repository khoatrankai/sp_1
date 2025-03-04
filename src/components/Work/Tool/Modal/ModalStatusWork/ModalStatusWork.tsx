"use client";
import React, { Ref, useRef, useState } from "react";
import { Button, Form, Input, Modal, Select, Table } from "antd";
import usePostData from "@/hooks/usePostData";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import { IoIosAdd } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import activityService from "@/services/activityService";
import { Option } from "antd/es/mentions";
import {
  ICreateStatusWork,
  IGetStatusWork,
  IUpdateStatusWork,
} from "@/models/activityInterface";
import { fetchStatusWork } from "@/redux/store/slices/activitySlices/status_work.slice";
import { fetchTypeActivities } from "@/redux/store/slices/activitySlices/type_activity.slice";
import { fetchTypeWork } from "@/redux/store/slices/activitySlices/type_work.slice";
import { fetchWorks } from "@/redux/store/slices/activitySlices/work.slide";
import { MdWorkOutline } from "react-icons/md";
import ModalTypeWork from "../ModalTypeWork/ModalTypeWork";
type Props = {
  refBtnStatus?: Ref<HTMLButtonElement>;
};
const ModalStatusWork = ({ refBtnStatus }: Props) => {
  const refBtnType = useRef<HTMLButtonElement>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [indexEdit, setIndexEdit] = useState<number>(-1);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataTypeWork } = useSelector(
    (state: RootState) => state.get_type_work
  );

  const { datas: dataStatusWork } = useSelector(
    (state: RootState) => state.get_status_work
  );

  const handlePushIndex = (index: number) => {
    setIndexEdit(index);
    formTypeEdit.setFieldsValue({
      ...dataStatusWork?.[index],
      type_work: dataStatusWork?.[index].type_work?.type_work_id,
    });
  };

  // const [dataSource, setDataSource] = useState<ITypeProduct[] | []>([]);
  const [tabFormType, setTabFormType] = useState<boolean>(false);
  const { postdata } = usePostData();
  const [formType] = useForm();
  const [formTypeEdit] = useForm();

  // useEffect(() => {
  //   console.log(dataSource);
  // }, [dataSource]);
  const columns: ColumnsType<IGetStatusWork> = [
    {
      title: "Mã trạng thái",
      dataIndex: "status_work_id",
      key: "status_work_id",
      render: (value, record, index) => (
        <div className="flex gap-1 items-center">
          #{index + 1}.{value}
        </div>
      ),
    },
    {
      title: "Tên loại",
      dataIndex: ["type_work", "name"],
      width: "25%",
      key: "name_type",
      render: (value) => {
        return (
          <>
            <strong className="flex gap-2 items-center">{value}</strong>
          </>
        );
      },
    },
    {
      title: "Tag trạng thái",
      dataIndex: "name_tag",
      width: "25%",
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
      title: "Tên trạng thái",
      dataIndex: "name",
      width: "25%",
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

  const handleSubmit = async (values: ICreateStatusWork) => {
    try {
      const statusCode = await postdata(() =>
        activityService.createStatusWork(values)
      );

      if (statusCode === 201) {
        dispatch(fetchStatusWork());
        dispatch(fetchTypeActivities());
        formType.resetFields();
        setTabFormType(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  const handleSubmitEdit = async (values: IUpdateStatusWork) => {
    try {
      const statusCode = await postdata(() =>
        activityService.updateStatusWork(
          dataStatusWork?.[indexEdit ?? 0].status_work_id ?? "",
          values
        )
      );
      if (statusCode === 200) {
        dispatch(fetchStatusWork());
        dispatch(fetchTypeWork());
        dispatch(fetchWorks());
        setIndexEdit(-1);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  return (
    <>
      <Button
        hidden={refBtnStatus ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        onClick={showModal}
        ref={refBtnStatus}
      >
        Trạng thái hoạt động
      </Button>
      <Modal
        title={
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span>Trạng thái hoạt động</span>
            <Button
              className="text-white font-semibold bg-orange-500"
              icon={<IoIosAdd />}
              type="default"
              onClick={() => {
                formType.resetFields();
                setTabFormType(!tabFormType);
              }}
            />
            <Button
              icon={<MdWorkOutline />}
              onClick={() => {
                refBtnType.current?.click();
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
                name="type_work"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Select
                  placeholder="Chọn loại"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {dataTypeWork?.map((dt) => (
                    <Option key={dt.type_work_id} value={dt.type_work_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên trạng thái",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên trạng thái" />
              </Form.Item>
              <Form.Item
                name="name_tag"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tag trạng thái",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tag trạng thái" />
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
                name="type_work"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Select
                  placeholder="Chọn loại"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {dataTypeWork?.map((dt) => (
                    <Option key={dt.type_work_id} value={dt.type_work_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên trạng thái",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên trạng thái" />
              </Form.Item>

              <Form.Item
                name="name_tag"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tag trạng thái",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tag trạng thái" />
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
              <Table<IGetStatusWork>
                columns={columns}
                scroll={{ x: "max-content" }}
                className="custom-table"
                // rowSelection={rowSelection}
                dataSource={dataStatusWork}
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
      <ModalTypeWork refBtnType={refBtnType as Ref<HTMLButtonElement>} />
    </>
  );
};

export default ModalStatusWork;
