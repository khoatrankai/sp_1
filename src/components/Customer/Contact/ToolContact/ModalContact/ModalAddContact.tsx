/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from "@/hooks/usePostData";
import { AppDispatch } from "@/redux/store/store";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { Option } from "antd/es/mentions";
// import SubMenu from "antd/es/menu/SubMenu";
import React, { Ref, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IoAddOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useForm } from "antd/es/form/Form";
import CustomFormData from "@/utils/CustomFormData";
import { Moment } from "moment";
import dayjs from "dayjs";
import { ICreateAccountCustomers } from "@/models/customerInterface";
import customerService from "@/services/customerService";
import { fetchCustomerAbout } from "@/redux/store/slices/customerSlices/about_customer.slice";
import { useParams } from "next/navigation";

type Props = {
  refBtnCustomer?: Ref<HTMLButtonElement>;
};

export default function ModalAddContact({ refBtnCustomer }: Props) {
  const [filePicture, setFilePicture] = useState<UploadFile>();
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();

  const [form] = useForm();
  const { customerID } = useParams();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: ICreateAccountCustomers) => {
    const formdata = CustomFormData(
      Object.entries({
        ...values,
        customer_info: customerID,
        picture_url: [filePicture?.originFileObj as File],
      }).reduce((acc: any, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {})
    );
    const res = await postdata(() =>
      customerService.createAccountCustomer(formdata)
    );
    if (res === 200 || res === 201) {
      form.resetFields();
      setIsModalVisible(false);
      // dispatch(fetchCustomerInfos());
      dispatch(fetchCustomerAbout());
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
        hidden={refBtnCustomer ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnCustomer}
      >
        Thêm tài khoản
      </Button>
      <Modal
        title="Tạo tài khoản"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          form={form}
          style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
        >
          {/* <Menu
            mode="inline"
            style={{ width: "100%" }}
            defaultOpenKeys={["info"]}
          >
            <SubMenu title="Thông tin khách hàng" key="info"> */}
          <div className="flex flex-wrap gap-2 h-fit w-fit rounded-lg p-1">
            <Form.Item
              name="full_name"
              className="!m-0"
              label="Tên khách"
              rules={[
                { required: true, message: "Vui lòng nhập tên công ty!" },
              ]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập password!" }]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="position"
              label="Vị trí"
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Giới tính"
              // rules={[
              //   { required: true, message: "Vui lòng nhập loại tiền tệ!" },
              // ]}

              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Select
                placeholder="Select a currency type"
                defaultValue={"male"}
              >
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="phone_number"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="date_of_birth"
              label="Ngày sinh"
              initialValue=""
              className=" mb-0"
              style={{ minWidth: "320px", flex: "1 1 0%" }}
              getValueFromEvent={(e: Moment) => e?.format("YYYY-MM-DD")}
              getValueProps={(e: string) => ({
                value: e ? dayjs(e) : "",
              })}
            >
              <DatePicker
                placeholder="Chọn ngày sinh"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
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
          </div>

          <Form.Item
            style={{ width: "100%", display: "flex", justifyContent: "end" }}
          >
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
