import ModalAddContract from "@/components/Contract/Tool/Modal/ModalContract";
import ModalAddSupplier from "@/components/Supplier/Tool/Modal/ModalSupplier";
import usePostData from "@/hooks/usePostData";
import { ICreatePayment } from "@/models/contractInterface";

// import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
import { fetchPayments } from "@/redux/store/slices/contractSlices/payment.slide";
import { AppDispatch, RootState } from "@/redux/store/store";
import contractService from "@/services/contractService.";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tabs,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import TabPane from "antd/es/tabs/TabPane";
import moment from "moment";
import React, { Ref, useEffect, useRef, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ModalTypeMethod from "./ModalTypeMethod/ModalTypeMethod";
import { useParams } from "next/navigation";
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";

// type Props = {}

export default function ModalAddPayment() {
  const { customerID, projectID } = useParams();
  const refBtnContract = useRef<HTMLButtonElement>();
  const refBtnSupplier = useRef<HTMLButtonElement>();
  const refBtnTypeMethod = useRef<HTMLButtonElement>();
  const { datas: dataContracts } = useSelector(
    (state: RootState) => state.get_contracts
  );
  const { datas: dataTypesProduct } = useSelector(
    (state: RootState) => state.type_product
  );
  const { datas: dataSupplier } = useSelector(
    (state: RootState) => state.get_supplier
  );
  const { datas: dataVat } = useSelector(
    (state: RootState) => state.vat_system
  );
  const { datas: dataMethod } = useSelector(
    (state: RootState) => state.get_type_method
  );
  useEffect(() => {
    if (customerID) {
      dispatch(fetchContracts({ customer: customerID as string }));
    }
  }, [customerID]);
  const [checkStatus, setCheckStatus] = useState<boolean>(false);

  const [form] = useForm();
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: ICreatePayment) => {
    const res = await postdata(() => contractService.createPayment(values));
    if (res === 200 || res === 201) {
      dispatch(fetchPayments({ project: projectID as string }));
      setIsModalVisible(false);
    }
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
        Thêm hóa đơn
      </Button>
      <Modal
        title="Tạo hóa đơn"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin hóa đơn" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >
              <Form.Item
                name="type"
                label="Thanh toán"
                rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Select status"
                  // defaultValue={"export"}
                  onChange={(e) => {
                    setCheckStatus(e === "import");
                  }}
                >
                  <Option value="import">Đến NCC</Option>
                  <Option value="export">Từ Khách hàng</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="contract"
                label="Hợp đồng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn hợp đồng!",
                  },
                ]}
                style={{ width: "100%", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn hợp đồng"
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
                          refBtnContract.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataContracts?.map((dt) => (
                    <Option key={dt.contract_id} value={dt.contract_id}>
                      {dt.name_contract}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="price"
                label="Giá trị(vnđ)"
                // rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <InputNumber
                  placeholder="Giá"
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
              <Form.Item
                name="type_product"
                label="Chi phí/Dịch vụ"
                // rules={[
                //   {
                //     required: true,
                //     message: "Vui lòng chọn khách hàng!",
                //   },
                // ]}
                style={{ width: "100%", flex: "1 1 0%" }}
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
                  {dataTypesProduct?.map((dt) => (
                    <Option key={dt.type_product_id} value={dt.type_product_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="supplier"
                label="Nhà cung cấp"
                rules={[
                  {
                    required: checkStatus,
                    message: "Vui lòng chọn cung cấp!",
                  },
                ]}
                style={{ width: "100%", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn nhà cung cấp"
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
                          refBtnSupplier.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataSupplier?.map((dt) => (
                    <Option key={dt.supplier_id} value={dt.supplier_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="date_expired"
                label="Ngày kết thúc"
                rules={[{ required: true }]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
                getValueProps={(value) => ({
                  value: value ? moment(value) : null,
                })}
              >
                <DatePicker
                  placeholder="Chọn ngày kết thúc"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                name="vat"
                label="Thuế"
                style={{ width: "100%", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn thuế"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {dataVat?.map((dt) => (
                    <Option key={dt.vat_id} value={dt.vat_id}>
                      {dt.type_vat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="type_method"
                label="Phương thức thanh toán"
                // rules={[
                //   {
                //     required: checkStatus,
                //     message: "Vui lòng chọn cung cấp!",
                //   },
                // ]}
                style={{ minWidth: "100%" }}
              >
                <Select
                  placeholder="Chọn phương thức thanh toán"
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
                          refBtnTypeMethod.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataMethod?.map((dt) => (
                    <Option key={dt.type_method_id} value={dt.type_method_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Tạo
          </Button>
        </div>
      </Modal>
      <ModalAddContract
        refBtnContract={refBtnContract as Ref<HTMLButtonElement>}
      />
      <ModalAddSupplier
        refBtnSupplier={refBtnSupplier as Ref<HTMLButtonElement>}
      />
      <ModalTypeMethod
        refBtnType={refBtnTypeMethod as Ref<HTMLButtonElement>}
      />
    </>
  );
}
