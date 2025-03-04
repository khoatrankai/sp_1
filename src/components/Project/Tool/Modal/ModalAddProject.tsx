/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Ref, useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  DatePicker,
  Divider,
  Upload,
  UploadProps,
  UploadFile,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { IoAddOutline } from "react-icons/io5";
import usePostData from "@/hooks/usePostData";
import { ICreateProject } from "@/models/projectInterface";
import projectService from "@/services/projectService";
import { fetchProjects } from "@/redux/store/slices/projectSlices/get_all_project.slice";
import ModalTypeProject from "./ModalTypeProject/ModalTypeProject";
import ModalAddCustomer from "@/components/Customer/ToolCustomer/ModalCustomer/ModalAddCustomer";
import CustomFormData from "@/utils/CustomFormData";
import { useParams } from "next/navigation";
type Props = {
  refBtnProject?: Ref<HTMLButtonElement>;
};
const ModalAddProject = ({ refBtnProject }: Props) => {
  const { customerID } = useParams();
  const [filePicture, setFilePicture] = useState<UploadFile>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const refBtnGroup = useRef<HTMLButtonElement>();
  const refBtnCustomer = useRef<HTMLButtonElement>();
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );

  const { datas: dataOpportunity } = useSelector(
    (state: RootState) => state.get_opportunities
  );
  useEffect(() => {
    if (customerID) {
      form.setFieldValue("customer", customerID);
    }
  }, [customerID]);
  const { datas: dataTypes } = useSelector(
    (state: RootState) => state.type_projects
  );
  const { datas: dataCustomer } = useSelector(
    (state: RootState) => state.infos_customer
  );
  const { postdata } = usePostData();

  const [form] = useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: ICreateProject) => {
    try {
      const formdata = CustomFormData(
        Object.entries({
          ...values,
          picture_url: [filePicture?.originFileObj as File],
        }).reduce((acc: any, [key, value]) => {
          if (value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {})
      );
      const res = await postdata(() => projectService.createProject(formdata));
      if (res === 200 || res === 201) {
        dispatch(
          fetchProjects(
            customerID ? { customer: customerID as string } : undefined
          )
        );
        form.resetFields();
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };
  const handleChange: UploadProps["onChange"] = ({ file: newFileList }) => {
    setFilePicture(newFileList);
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
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnProject}
      >
        Tạo dự án
      </Button>
      <Modal
        title="Điền form dự án"
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

          <Form.Item
            name="start_date"
            label="Ngày bắt đầu"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <DatePicker
              placeholder="Chọn ngày bắt đầu"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="Ngày kết thúc"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <DatePicker
              placeholder="Chọn ngày kết thúc"
              style={{ width: "100%" }}
            />
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
              // fileList={fileList}
              // onPreview={handlePreview}
              onChange={handleChange}
            >
              {uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            style={{ width: "100%", display: "flex", justifyContent: "end" }}
          >
            <Button type="primary" htmlType="submit">
              Tạo
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

export default ModalAddProject;
