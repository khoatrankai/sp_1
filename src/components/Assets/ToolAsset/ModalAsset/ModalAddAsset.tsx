/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from "@/hooks/usePostData";
import { AppDispatch, RootState } from "@/redux/store/store";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import { Option } from "antd/es/mentions";
// import SubMenu from "antd/es/menu/SubMenu";
import React, { Ref, useEffect, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";
import { useForm } from "antd/es/form/Form";
// import { MdOutlineDocumentScanner } from "react-icons/md";
import { CreateAsset, IGetCodeProduct } from "@/models/productInterface";
import productService from "@/services/productService";
import { useSelector } from "react-redux";
import moment from "moment";
import ModalAddProject from "@/components/Project/Tool/Modal/ModalAddProject";
import ModalAddCustomer from "@/components/Customer/ToolCustomer/ModalCustomer/ModalAddCustomer";
import { useDispatch } from "react-redux";
import { fetchAssets } from "@/redux/store/slices/productSlices/get_asset.slice";

type Props = {
  refBtnAsset?: Ref<HTMLButtonElement>;
};

export default function ModalAddAsset({ refBtnAsset }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  // const refBtn = useRef<HTMLButtonElement>();
  const refBtnProject = useRef<HTMLButtonElement>();
  const refBtnCustomer = useRef<HTMLButtonElement>();
  const { postdata } = usePostData();

  const [form] = useForm();
  const [dataCode, setDataCode] = useState<IGetCodeProduct[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { datas: dataCustomer } = useSelector(
    (state: RootState) => state.infos_customer
  );

  const { datas: dataProject } = useSelector(
    (state: RootState) => state.get_projects
  );
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchData = async () => {
    const res = await productService.getCodeProduct();
    if (res.statusCode === 200) {
      setDataCode(res.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleSubmit = async (values: CreateAsset) => {
    const res = await postdata(() => productService.createAsset(values));
    if (res === 200 || res === 201) {
      form.resetFields();
      setIsModalVisible(false);
      dispatch(fetchAssets());
    }
  };

  return (
    <>
      <Button
        hidden={refBtnAsset ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnAsset}
      >
        Thêm tài sản
      </Button>
      <Modal
        title="Tạo tài sản"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        {/* <Button
        onClick={()=>{refBtn.current?.click()}}
        icon={<MdOutlineDocumentScanner />}
      >
        Quét cccd
      </Button> */}
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
              name="asset_code"
              className="!m-0"
              label="Mã tài sản"
              rules={[{ required: true, message: "Vui lòng nhập mã tài sản!" }]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="serial_number"
              className="!m-0"
              label="Serial"
              rules={[{ required: true, message: "Vui lòng nhập mã serial!" }]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="name"
              className="!m-0"
              label="Tên tài sản"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="code_product"
              label="Mã sản phẩm"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn sản phẩm!",
                },
              ]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Select
                placeholder="Chọn mã sản phầm"
                showSearch
                filterOption={(input, option) => {
                  const text = Array.isArray(option?.children)
                    ? option.children.join("")
                    : option?.children ?? "";
                  return text.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {dataCode?.map((dt) => (
                  <Option key={dt.code_product_id} value={dt.code_product_id}>
                    {dt.code_product_id}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              initialValue="new"
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Select>
                <Option value="new">Mới</Option>
                <Option value="in_use">Đang sử dụng</Option>
                <Option value="under_repair">Đang sửa chữa</Option>
                <Option value="retired">Ngừng sử dụng</Option>
                <Option value="damaged">Hỏng</Option>
                <Option value="lost">Mất</Option>
                <Option value="disposed">Đã loại bỏ</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="customer"
              label="Khách hàng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập nhóm khách hàng!",
                },
              ]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
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
                {dataCustomer?.map((dt) => (
                  <Option key={dt.info_id} value={dt.info_id}>
                    {dt.name_company}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="project"
              label="Dự án"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn dự án!",
                },
              ]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Select
                placeholder="Chọn dự án"
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
                        refBtnProject.current?.click();
                      }}
                    >
                      + Thêm tùy chọn mới
                    </Button>
                  </>
                )}
              >
                {dataProject?.map((dt) => (
                  <Option key={dt.project_id} value={dt.project_id}>
                    {dt.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="warranty_expiry"
              label="Ngày hết hạn"
              rules={[{ required: true }]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
              getValueProps={(value) => ({
                value: value ? moment(value) : null,
              })}
            >
              <DatePicker
                placeholder="Chọn ngày mua"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá trị tài sản"
              // rules={[{ required: true }]}
              style={{ minWidth: "240px", flex: "1 1 0%" }}
            >
              <InputNumber
                placeholder="Price"
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
              name="description"
              label="Mô tả"
              style={{ width: "100%" }}
            >
              <Input.TextArea
                placeholder="Description"
                autoSize={{ minRows: 3 }}
              />
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
      <ModalAddProject
        refBtnProject={refBtnProject as Ref<HTMLButtonElement>}
      />
      <ModalAddCustomer
        refBtnCustomer={refBtnCustomer as Ref<HTMLButtonElement>}
      />
    </>
  );
}
