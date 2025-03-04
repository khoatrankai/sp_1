/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Ref, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import projectService from "@/services/projectService";
import usePostData from "@/hooks/usePostData";
import { IUpdateProject } from "@/models/projectInterface";
import { fetchProjects } from "@/redux/store/slices/projectSlices/get_all_project.slice";
import ModalTypeProject from "./ModalTypeProject/ModalTypeProject";
import ModalAddCustomer from "@/components/Customer/ToolCustomer/ModalCustomer/ModalAddCustomer";
import { fetchProjectTypeFulls } from "@/redux/store/slices/projectSlices/get_full_type.slice";
import CustomFormData from "@/utils/CustomFormData";
import dayjs from "dayjs";
import { onChangeImagePreview } from "@/redux/store/slices/image-preview.slice";

type Props = {
  ID: string;
  refBtnProject?: Ref<HTMLButtonElement>;
  type?: string;
  setID?: (value: React.SetStateAction<string>) => void;
};

const ModalUpdateProject = ({ ID, refBtnProject, type, setID }: Props) => {
  const refBtnGroup = useRef<HTMLButtonElement>();
  const refBtnCustomer = useRef<HTMLButtonElement>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [filePicture, setFilePicture] = useState<UploadFile[]>([]);
  const { datas: dataTypes } = useSelector(
    (state: RootState) => state.type_projects
  );
  const { datas: dataOpportunity } = useSelector(
    (state: RootState) => state.get_opportunities
  );
  const { datas: dataCustomer } = useSelector(
    (state: RootState) => state.infos_customer
  );
  const [form] = useForm();
  const dispatch = useDispatch<AppDispatch>();

  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );
  const { postdata } = usePostData();

  const fetchData = async () => {
    const res = await projectService.getProject(ID);
    if (res.statusCode === 200) {
      form.setFieldsValue(res.data);
      setFilePicture([
        {
          uid: res.data.project_id,
          name: "logo.png",
          status: "done",
          url: res.data.picture_url,
        },
      ]);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    fetchData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if (setID) {
      setID("");
    }
  };

  const handleChange: UploadProps["onChange"] = ({ file: newFileList }) => {
    if (newFileList.status === "removed") {
      setFilePicture([]);
    } else setFilePicture([newFileList]);
  };

  const handleSubmit = async (values: IUpdateProject) => {
    try {
      const formdata = CustomFormData(
        Object.entries({
          ...values,
          picture_url:
            filePicture.length > 0
              ? [filePicture?.[0]?.originFileObj as File]
              : null,
        }).reduce((acc: any, [key, value]) => {
          if (value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {})
      );

      const res = await postdata(() =>
        projectService.updateProject(ID, formdata)
      );
      if (res === 200 || res === 201) {
        dispatch(fetchProjects());
        form.resetFields();
        setIsModalVisible(false);
        if (type === "gantt" && setID) {
          dispatch(fetchProjectTypeFulls());
          setID("" as string);
        }
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Button
        hidden={refBtnProject ? true : false}
        type="text"
        className="text-xs text-yellow-500 font-semibold"
        onClick={showModal}
        ref={refBtnProject}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Cập nhật dự án"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}
        >
          <Form.Item
            name="name"
            label="Tên dự án"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
            rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
          >
            <Input placeholder="Tên dự án" />
          </Form.Item>
          <Form.Item
            name="customer"
            label="Khách hàng"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng" },
            ]}
          >
            <Select
              placeholder="Chọn khách hàng"
              showSearch
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
                      refBtnCustomer.current?.click();
                    }}
                  >
                    + Thêm tùy chọn mới
                  </Button>
                </>
              )}
            >
              {dataCustomer?.map((item) => (
                <Select.Option key={item.info_id} value={item.info_id}>
                  {item.name_company}
                </Select.Option>
              ))}
            </Select>

            {/* </div> */}
          </Form.Item>
          <Form.Item
            name="opportunity"
            label="Cơ hội"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
            rules={[{ required: true, message: "Vui lòng chọn cơ hội" }]}
          >
            <Select
              placeholder="Chọn cơ hội"
              showSearch
              filterOption={(input, option) => {
                const text = Array.isArray(option?.children)
                  ? option.children.join("")
                  : option?.children ?? "";
                return text.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {dataOpportunity?.map((item) => (
                <Select.Option
                  key={item.opportunity_id}
                  value={item.opportunity_id}
                >
                  {item.company_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại dự án"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
            rules={[{ required: true, message: "Vui lòng chọn loại dự án" }]}
          >
            {/* <div className="flex gap-1"> */}
            <Select
              placeholder="Chọn loại"
              showSearch
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
              {dataTypes?.map((item) => (
                <Select.Option key={item.type_id} value={item.type_id}>
                  {item.name_type}
                </Select.Option>
              ))}
            </Select>

            {/* </div> */}
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            style={{ minWidth: "220px", flex: "1 1 0%" }}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="waiting">Đang chờ</Select.Option>
              <Select.Option value="start">Bắt đầu</Select.Option>
              <Select.Option value="pause">Tạm dừng</Select.Option>
              <Select.Option value="cancel">Hủy</Select.Option>
              <Select.Option value="completed">Hoàn thành</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá trị (vnđ)"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <InputNumber
              placeholder="Giá trị"
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
            />
          </Form.Item>

          <Form.Item
            name="time_job"
            label="Thời gian (giờ)"
            style={{ minWidth: "220px", flex: "1 1 0%" }}
          >
            <InputNumber placeholder="Thời gian công việc" className="w-full" />
          </Form.Item>

          <Form.Item
            name="start_date"
            label="Ngày bắt đầu"
            initialValue=""
            className=" mb-0"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
            getValueFromEvent={(e: any) => e?.format("YYYY-MM-DD")}
            getValueProps={(e: string) => ({
              value: e ? dayjs(e) : "",
            })}
          >
            <DatePicker
              placeholder="Chọn ngày bắt đầu"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="Ngày kết thúc"
            initialValue=""
            className=" mb-0"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
            getValueFromEvent={(e: any) => e?.format("YYYY-MM-DD")}
            getValueProps={(e: string) => ({
              value: e ? dayjs(e) : "",
            })}
          >
            <DatePicker
              placeholder="Chọn ngày kết thúc"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="user_support"
            label="Nhân viên hỗ trợ"
            style={{ minWidth: "220px", flex: "1 1 0%" }}
          >
            <Select placeholder="Chọn nhân viên">
              {dataUsers?.map((item) => (
                <Select.Option key={item.user_id} value={item.user_id}>
                  {item.first_name} {item.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Mô tả" style={{ width: "100%" }}>
            <Input.TextArea
              placeholder="Mô tả dự án"
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
          <Form.Item
            // valuePropName="fileList"
            // getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            name="picture_url"
            label="Ảnh đại diện"
            className="!m-0"
            // rules={[{ required: false, message: "Vui lòng chọn loại thuế!" }]}
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Upload
              maxCount={1}
              action=""
              listType="picture-card"
              fileList={filePicture}
              onPreview={(e) => {
                dispatch(onChangeImagePreview(e.url));
              }}
              onChange={handleChange}
            >
              {filePicture.length > 0 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            style={{ width: "100%", display: "flex", justifyContent: "end" }}
          >
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ModalTypeProject refBtnGroup={refBtnGroup as Ref<HTMLButtonElement>} />
      <ModalAddCustomer
        refBtnCustomer={refBtnCustomer as Ref<HTMLButtonElement>}
      />
    </>
  );
};

export default ModalUpdateProject;
