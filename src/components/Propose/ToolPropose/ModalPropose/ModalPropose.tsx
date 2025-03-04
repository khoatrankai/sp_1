import usePostData from "@/hooks/usePostData";
import { CreatePropose } from "@/models/proposeInterface";
import { ProductInfo } from "@/models/systemInterface";
import { RootState } from "@/redux/store/store";
import proposeService from "@/services/proposeService";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tabs,
} from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import { ColumnsType } from "antd/es/table";
import TabPane from "antd/es/tabs/TabPane";
import React, { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";

// type Props = {}

export default function ModalPropose() {
  const { datas: dataProvinces } = useSelector(
    (state: RootState) => state.province_system
  );
  const { datas: dataVats } = useSelector(
    (state: RootState) => state.vat_system
  );
  const [tabFormProduct, setTabFormProduct] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<ProductInfo[] | []>([]);
  const columns: ColumnsType<ProductInfo> = [
    {
      title: "Loại sản phẩm",
      dataIndex: "type",
      key: "type",
      render: (value) => (
        <div className="flex gap-1 items-center">
          {value === "VT" ? (
            <>
              <div className="min-w-1 min-h-1 rounded-full bg-blue-500" />
              <div className="min-w-1 min-h-1 rounded-full bg-blue-500" />

              {value}
            </>
          ) : (
            <>
              {" "}
              <div className="min-w-1 min-h-1 rounded-full bg-red-500" />
              {value}
            </>
          )}
        </div>
      ),
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "code_product",
      key: "code_product",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name_product",
      key: "name_product",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity_product",
      key: "quantity",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thuế VAT",
      dataIndex: "vat",
      key: "vat",
      render: (value) => (
        <>
          {
            dataVats?.find((dt) => {
              return dt.vat_id === value;
            })?.type_vat
          }
          %
        </>
      ),
    },

    {
      title: "Giá sản phẩm (VNĐ)",
      dataIndex: "price_product",
      key: "price_product",
      render: (price) => {
        return `${price.toLocaleString("vi-VN")}đ`;
      }, // Định dạng số thành VNĐ
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      render: () => (
        <div className="flex gap-2 items-center">
          <Button type="primary" className="bg-yellow-500" icon={<MdEdit />} />
          <Button type="primary" className="bg-red-500" icon={<MdDelete />} />
        </div>
      ), // Định dạng số thành VNĐ
    },
  ];
  const [form] = useForm();
  const [formProduct] = useForm();
  const { datas: dataCustomer } = useSelector(
    (state: RootState) => state.infos_customer
  );
  const { postdata } = usePostData();

  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );
  const [dataRelate, setDataRelate] = useState();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: CreatePropose) => {
    const res = await postdata(() => proposeService.createPropose(values));
    if (res === 200 || res === 201) {
      setIsModalVisible(false);
    }
  };

  const handleAddProduct = () => {
    formProduct.submit();
  };

  const handlePush = async (data: ProductInfo) => {
    console.log(data);
    setDataSource([...dataSource, data]);
  };

  const btnSubmit = async () => {
    form.submit();
  };

  return (
    <>
      <Button
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
      >
        Thêm đề xuất
      </Button>
      <Modal
        title="Tạo đề xuất"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin đề xuất" key={1}>
            <Form
              // layout="inline"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
            >
              <Form.Item
                name="name_propose"
                label="Tên đề xuất"
                rules={[
                  {
                    required: true,
                    message: "Please input the proposal name!",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="type_related"
                label="Liên quan đến"
                rules={[{ required: true }]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Select a type"
                  onChange={(value) => {
                    setDataRelate(value);
                  }}
                >
                  <Option value={"OP"}>Cơ hội</Option>
                  <Option value={"CT"}>Khách hàng</Option>
                </Select>
              </Form.Item>
              {dataRelate && (
                <Form.Item
                  name="related_id"
                  label={`${
                    dataRelate === "CT" ? "ID Khách hàng" : "ID Cơ hội"
                  }`}
                  rules={[{ required: true }]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  {dataRelate === "CT" && (
                    <Select
                      placeholder="Select a related_id"
                      showSearch
                      filterOption={(input, option) => {
                        return (option?.children?.join("") ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase());
                      }}
                    >
                      {dataCustomer?.map((dt) => (
                        <Option key={dt.info_id} value={dt.info_id}>
                          {dt?.infoContacts?.[0]?.customer.full_name}(
                          {dt.name_company})
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              )}

              <Form.Item
                name="date_start"
                label="Ngày bắt đầu"
                rules={[{ required: true }]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input type="datetime-local" />
              </Form.Item>
              <Form.Item
                name="date_end"
                label="Ngày kết thúc"
                rules={[{ required: true }]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input type="datetime-local" />
              </Form.Item>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select placeholder="Select status">
                  <Option value="draff">Draff</Option>
                  <Option value="send">Send</Option>
                  <Option value="open">Open</Option>
                  <Option value="edit">Edit</Option>
                  <Option value="refuse">Refuse</Option>
                  <Option value="accept">Accept</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="type_discount"
                label="Loại thuế"
                rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select placeholder="Select discount type">
                  <Option value="none">None</Option>
                  <Option value="before">Before</Option>
                  <Option value="after">After</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="type_money"
                label="Đơn vị tiền"
                rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select placeholder="Select a currency type">
                  <Option value="vnd">VND</Option>
                  <Option value="usd">USD</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="staff_support"
                label="Người phụ trách"
                rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn nhân viên"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
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
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                ]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone_number"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid phone number!",
                  },
                ]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="send_to"
                label="Gửi đến"
                rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="province"
                label="Khu vực"
                rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select placeholder="Chọn khu vực">
                  {dataProvinces?.map((dt) => (
                    <Option key={dt.province_id} value={dt.province_id}>
                      {dt.name_province}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Thông tin sản phẩm" key={2}>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Select
                  placeholder="Chọn sản phẩm cần thêm"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {dataUsers?.map((dt) => (
                    <Option key={dt.user_id} value={dt.user_id}>
                      {dt.first_name} {dt.last_name}
                    </Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  onClick={() => {
                    formProduct.resetFields();
                    setTabFormProduct(!tabFormProduct);
                  }}
                >
                  Thêm khác
                </Button>
              </div>
              <div
                className="bg-slate-200 px-1 py-2 rounded-md"
                hidden={!tabFormProduct}
              >
                <Form
                  form={formProduct}
                  onFinish={handlePush}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <Form.Item
                    name="code_product"
                    rules={[
                      {
                        required: false,
                      },
                    ]}
                    style={{ minWidth: "200px", flex: "1 1 0%", margin: "0" }}
                  >
                    <Input placeholder="Mã sản phẩm" />
                  </Form.Item>
                  <Form.Item
                    name="name_product"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập thông tin sản phẩm",
                      },
                    ]}
                    style={{ minWidth: "240px", flex: "1 1 0%", margin: "0" }}
                  >
                    <Input placeholder="Tên sản phẩm" />
                  </Form.Item>

                  <Form.Item
                    name="quantity_product"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập thông tin số lượng",
                      },
                    ]}
                    style={{ minWidth: "150px", flex: "1 1 0%", margin: "0" }}
                  >
                    <InputNumber className="w-full" placeholder="Số lượng" />
                  </Form.Item>
                  <Form.Item
                    name="price_product"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập thông tin giá trị",
                      },
                    ]}
                    style={{ minWidth: "150px", flex: "1 1 0%", margin: "0" }}
                  >
                    <InputNumber className="w-full" placeholder="Giá trị" />
                  </Form.Item>
                  <Form.Item
                    name="type"
                    rules={[{ required: false }]}
                    style={{ minWidth: "100px", flex: "1 1 0%", margin: "0" }}
                  >
                    <Select placeholder="Chọn loại sản phẩm">
                      <Option key={"TB"} value={"TB"}>
                        Thiết bị
                      </Option>
                      <Option key={"VT"} value={"VT"}>
                        Vật tư
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="vat"
                    rules={[{ required: true }]}
                    style={{ minWidth: "100px", flex: "1 1 0%", margin: "0" }}
                  >
                    <Select placeholder="Chọn thuế">
                      {dataVats?.map((dt) => (
                        <Option key={dt.vat_id} value={dt.vat_id}>
                          {dt.type_vat}%
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập thông tin mô tả",
                      },
                    ]}
                    style={{ width: "100%", margin: "0" }}
                  >
                    <TextArea placeholder="Mô tả" autoSize={{ minRows: 3 }} />
                  </Form.Item>
                  <Form.Item
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "end",
                      margin: "0",
                    }}
                  >
                    <Button
                      className="bg-green-500 text-white font-semibold"
                      onClick={handleAddProduct}
                    >
                      Thêm
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className="border-t-2 w-full overflow-x-auto">
                <div className="w-fit">
                  <Table<ProductInfo>
                    columns={columns}
                    // rowSelection={rowSelection}
                    dataSource={dataSource}
                    scroll={{ x: "max-content" }}
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
          </TabPane>
        </Tabs>
        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Tạo
          </Button>
        </div>
      </Modal>
    </>
  );
}
