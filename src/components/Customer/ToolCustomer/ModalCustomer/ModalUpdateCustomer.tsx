/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from "@/hooks/usePostData";
import { IUpdateCustomerInfo } from "@/models/customerInterface";
import { fetchCustomerAbout } from "@/redux/store/slices/customerSlices/about_customer.slice";
import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
import { onChangeImagePreview } from "@/redux/store/slices/image-preview.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import customerService from "@/services/customerService";
import CustomFormData from "@/utils/CustomFormData";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
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
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

type Props = {
  info_id?: string;
};

export default function ModalUpdateCustomer({ info_id }: Props) {
  const [form] = useForm();
  const { customerID } = useParams();
  const [filePicture, setFilePicture] = useState<UploadFile[]>([]);
  const refBtnGroup = useRef<HTMLButtonElement>();
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataProvinces } = useSelector(
    (state: RootState) => state.province_system
  );

  const { postdata } = usePostData();

  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );
  const { datas: dataGroup } = useSelector(
    (state: RootState) => state.get_group_customer
  );

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const fetchData = async () => {
    const res = await customerService.getCustomerID(
      info_id ?? customerID.toString()
    );
    if (res.statusCode === 200 && res.data) {
      form.setFieldsValue({
        ...res.data,
        group_customer: res.data?.group_customer?.group_id,
      });
      dispatch(fetchCustomerInfos());
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
    fetchData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (customerID && !info_id) {
      fetchData();
    }
  }, [customerID, info_id]);

  const handleChange: UploadProps["onChange"] = ({ file: newFileList }) => {
    if (newFileList.status === "removed") {
      setFilePicture([]);
    } else setFilePicture([newFileList]);
  };
  const handleSubmit = async (values: IUpdateCustomerInfo) => {
    const formdata = CustomFormData(
      Object.entries({
        ...values,
        info_id: info_id ?? customerID.toString(),
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
      customerService.updateCustomerInfo(formdata)
    );
    if (res === 200 || res === 201) {
      form.resetFields();
      setIsModalVisible(false);
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
      {customerID ? (
        <>
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
                name="name_company"
                className="!m-0"
                label="Tên công ty"
                rules={[
                  { required: true, message: "Vui lòng nhập tên công ty!" },
                ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="group_customer"
                label="Nhóm khách hàng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nhóm khách hàng!",
                  },
                ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn nhóm"
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
                  {dataGroup?.map((dt) => (
                    <Option key={dt.group_id} value={dt.group_id}>
                      {dt.name_group}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="tax_code"
                label="Mã số thuế"
                rules={[
                  { required: true, message: "Vui lòng nhập mã số thuế!" },
                ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="address_delivery"
                label="Địa chỉ giao hàng"
                // rules={[
                //   {
                //     required: true,
                //     message: "Vui lòng nhập địa chỉ giao hàng!",
                //   },
                // ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="province"
                label="Tỉnh/Thành phố"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tỉnh/thành phố!",
                  },
                ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Select placeholder="Chọn khu vực">
                  {dataProvinces?.map((dt) => (
                    <Option key={dt.province_id} value={dt.province_id}>
                      {dt.name_province}
                    </Option>
                  ))}
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
                name="type_money"
                label="Loại tiền tệ"
                // rules={[
                //   { required: true, message: "Vui lòng nhập loại tiền tệ!" },
                // ]}

                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Select a currency type"
                  defaultValue={"vnd"}
                >
                  <Option value="vnd">VND</Option>
                  <Option value="usd">USD</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="staff_support"
                label="Nhân viên hỗ trợ"
                // rules={[
                //   {
                //     required: true,
                //     message: "Vui lòng nhập tên nhân viên hỗ trợ!",
                //   },
                // ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn nhân viên"
                  showSearch
                  filterOption={(input, option) => {
                    return (option?.children?.join("") ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                >
                  {dataUsers?.map((dt) => (
                    <Option key={dt.user_id} value={dt.user_id}>
                      {dt.first_name} {dt.last_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="website"
                label="Website"
                // rules={[
                //   {
                //     required: true,
                //     message: "Vui lòng nhập địa chỉ website!",
                //   },
                // ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input />
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
            </div>

            <Form.Item
              style={{ width: "100%", display: "flex", justifyContent: "end" }}
            >
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <>
          <Button
            className="  text-xs text-yellow-500 font-semibold"
            type="text"
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
                  name="name_company"
                  className="!m-0"
                  label="Tên công ty"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên công ty!" },
                  ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="group_customer"
                  label="Nhóm khách hàng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập nhóm khách hàng!",
                    },
                  ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Select
                    placeholder="Chọn nhóm"
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
                    {dataGroup?.map((dt) => (
                      <Option key={dt.group_id} value={dt.group_id}>
                        {dt.name_group}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="tax_code"
                  label="Mã số thuế"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã số thuế!" },
                  ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="address_delivery"
                  label="Địa chỉ giao hàng"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Vui lòng nhập địa chỉ giao hàng!",
                  //   },
                  // ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="province"
                  label="Tỉnh/Thành phố"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tỉnh/thành phố!",
                    },
                  ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Select placeholder="Chọn khu vực">
                    {dataProvinces?.map((dt) => (
                      <Option key={dt.province_id} value={dt.province_id}>
                        {dt.name_province}
                      </Option>
                    ))}
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
                  name="type_money"
                  label="Loại tiền tệ"
                  // rules={[
                  //   { required: true, message: "Vui lòng nhập loại tiền tệ!" },
                  // ]}

                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Select
                    placeholder="Select a currency type"
                    defaultValue={"vnd"}
                  >
                    <Option value="vnd">VND</Option>
                    <Option value="usd">USD</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="staff_support"
                  label="Nhân viên hỗ trợ"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Vui lòng nhập tên nhân viên hỗ trợ!",
                  //   },
                  // ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Select
                    placeholder="Chọn nhân viên"
                    showSearch
                    filterOption={(input, option) => {
                      return (option?.children?.join("") ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }}
                  >
                    {dataUsers?.map((dt) => (
                      <Option key={dt.user_id} value={dt.user_id}>
                        {dt.first_name} {dt.last_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="website"
                  label="Website"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Vui lòng nhập địa chỉ website!",
                  //   },
                  // ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Input />
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
      )}
    </>
  );
}
