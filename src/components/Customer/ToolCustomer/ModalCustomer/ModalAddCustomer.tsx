/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from "@/hooks/usePostData";
import { CreateInfoCustomer } from "@/models/customerInterface";
import { fetchCustomerAbout } from "@/redux/store/slices/customerSlices/about_customer.slice";
import { fetchCustomerInfos } from "@/redux/store/slices/customerSlices/get_all_customer.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import customerService from "@/services/customerService";
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
import { Option } from "antd/es/mentions";
// import SubMenu from "antd/es/menu/SubMenu";
import React, { Ref, useEffect, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ModalGroupCustomer from "./ModalGroupCustomer/ModalGroupCustomer";
import { useForm } from "antd/es/form/Form";
import CustomFormData from "@/utils/CustomFormData";
import { MdOutlineDocumentScanner } from "react-icons/md";
import ModalUploadImage from "./ModalUploadImage";

type Props = {
  refBtnCustomer?: Ref<HTMLButtonElement>;
};

export default function ModalAddCustomer({ refBtnCustomer }: Props) {
  const [dataOK,setDataOK] = useState<any>()
  const refBtn = useRef<HTMLButtonElement>()
  const [filePicture, setFilePicture] = useState<UploadFile>();
  const { datas: dataProvinces } = useSelector(
    (state: RootState) => state.province_system
  );
  const refBtnGroup = useRef<HTMLButtonElement>();
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );
  const { datas: dataGroup } = useSelector(
    (state: RootState) => state.get_group_customer
  );

  const [form] = useForm();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(()=>{
    if(dataOK){
      form.setFieldsValue({name_company:dataOK.full_name,address_delivery:dataOK.place_of_residence})
    }
  },[dataOK])
  const handleSubmit = async (values: CreateInfoCustomer) => {
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
    const res = await postdata(() =>
      customerService.createInfoCustomer(formdata)
    );
    if (res === 200 || res === 201) {
      form.resetFields();
      setIsModalVisible(false);
      dispatch(fetchCustomerInfos());
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
        Thêm khách hàng
      </Button>
      <Modal
        title="Tạo khách hàng"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Button
        onClick={()=>{refBtn.current?.click()}}
        icon={<MdOutlineDocumentScanner />}
      >
        Quét cccd
      </Button>
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
              rules={[{ required: true, message: "Vui lòng nhập mã số thuế!" }]}
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
              <Select placeholder="Select a currency type" defaultValue={"vnd"}>
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
                // fileList={fileList}
                // onPreview={handlePreview}
                onChange={handleChange}
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </div>
          {/* </SubMenu> */}
          {/* <SubMenu title="Thông tin giao hàng" key="info_address">
              <div className="flex flex-wrap gap-2 h-fit w-fit rounded-lg p-1">
                <Form.Item
                  name="address_payment"
                  label="Địa chỉ thanh toán"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ thanh toán!",
                    },
                  ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="province_payment"
                  label="Tỉnh/Thành phố thanh toán"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tỉnh/thành phố thanh toán!",
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
                  name="address_delivery"
                  label="Địa chỉ giao hàng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ giao hàng!",
                    },
                  ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="province_delivery"
                  label="Tỉnh/Thành phố giao hàng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tỉnh/thành phố giao hàng!",
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
              </div>
            </SubMenu> */}
          {/* </Menu> */}

          <Form.Item
            style={{ width: "100%", display: "flex", justifyContent: "end" }}
          >
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
            <ModalUploadImage refBtnCustomer={refBtn as Ref<HTMLButtonElement>} setData={setDataOK}/>
      <ModalGroupCustomer refBtnGroup={refBtnGroup as Ref<HTMLButtonElement>} />
    </>
  );
}
