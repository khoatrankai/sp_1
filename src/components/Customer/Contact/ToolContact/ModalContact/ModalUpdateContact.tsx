/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from "@/hooks/usePostData";
import { IUpdateAccountCustomers } from "@/models/customerInterface";
import { fetchCustomerAbout } from "@/redux/store/slices/customerSlices/about_customer.slice";
import { fetchCustomerAccounts } from "@/redux/store/slices/customerSlices/get_all_account.slice";
import { fetchCustomerProfile } from "@/redux/store/slices/customerSlices/get_profile.slice";
import { onChangeImagePreview } from "@/redux/store/slices/image-preview.slice";
import { AppDispatch } from "@/redux/store/store";
import customerService from "@/services/customerService";
import roleCustomerService from "@/services/roleCustomerService/customerService";
import CustomFormData from "@/utils/CustomFormData";
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
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import dayjs from "dayjs";
import { Moment } from "moment";
import { useParams } from "next/navigation";
import React, { Ref, useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
  customer_id?: string;
  refBtnCustomer?: Ref<HTMLButtonElement>;
  type?: "customer" | "admin";
};

export default function ModalUpdateContact({
  customer_id,
  refBtnCustomer,
  type,
}: Props) {
  const [form] = useForm();
  const { customerID } = useParams();
  const [filePicture, setFilePicture] = useState<UploadFile[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const { postdata } = usePostData();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const fetchData = async () => {
    const res = await customerService.getIDAccountCustomer(
      customer_id as string
    );
    if (res.statusCode === 200 && res.data) {
      form.setFieldsValue({
        ...res.data,
      });

      dispatch(fetchCustomerAccounts({ customer_info: customerID as string }));
      dispatch(fetchCustomerAbout());
      setFilePicture([
        {
          uid: res.data.customer_id,
          name: "logo.png",
          status: "done",
          url: res.data.picture_url,
        },
      ]);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    if (!type) {
      fetchData();
    } else {
      dispatch(fetchCustomerProfile())
        .unwrap()
        .then((dt) => {
          if (dt.statusCode === 200) {
            form.setFieldsValue({
              ...dt.data,
            });
            setFilePicture([
              {
                uid: dt.data.customer_id,
                name: "logo.png",
                status: "done",
                url: dt.data.picture_url,
              },
            ]);
          }
        })
        .catch(() => {});
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChange: UploadProps["onChange"] = ({ file: newFileList }) => {
    if (newFileList.status === "removed") {
      setFilePicture([]);
    } else setFilePicture([newFileList]);
  };
  const handleSubmit = async (values: IUpdateAccountCustomers) => {
    const formdata = CustomFormData(
      Object.entries({
        ...values,
        customer_id: customer_id ?? customerID.toString(),
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
    if (type === "customer") {
      const res = await postdata(() =>
        roleCustomerService.updateAccountCustomerProfile(formdata)
      );
      if (res === 200 || res === 201) {
        form.resetFields();
        setIsModalVisible(false);
        dispatch(fetchCustomerProfile());
      }
    } else {
      const res = await postdata(() =>
        customerService.updateAccountCustomer(customer_id as string, formdata)
      );
      if (res === 200 || res === 201) {
        form.resetFields();
        setIsModalVisible(false);
        dispatch(
          fetchCustomerAccounts({ customer_info: customerID as string })
        );
      }
    }

    // console.log(values);
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
        className="  text-xs text-yellow-500 font-semibold"
        type="text"
        hidden={refBtnCustomer ? true : false}
        ref={refBtnCustomer}
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Cập nhật khách hàng"
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
                fileList={filePicture}
                onPreview={(e) => {
                  dispatch(onChangeImagePreview(e.url));
                }}
                onChange={handleChange}
              >
                {!(filePicture.length > 0) && uploadButton}
              </Upload>
            </Form.Item>
          </div>

          <Form.Item
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
