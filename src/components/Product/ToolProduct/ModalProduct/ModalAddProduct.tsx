"use client";
import React, { Ref, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Tabs,
  Upload,
} from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import { IGetListDetail, ProductInfo } from "@/models/productInterface";
import productService from "@/services/productService";
import CustomFormData from "@/utils/CustomFormData";
import usePostData from "@/hooks/usePostData";
import { IoAddOutline } from "react-icons/io5";
import { useForm } from "antd/es/form/Form";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { fetchProductInfos } from "@/redux/store/slices/productSlices/get_products";
import { useDispatch } from "react-redux";
import { fetchProductAbout } from "@/redux/store/slices/productSlices/get_about.slice";
import ModalAddSupplier from "@/components/Supplier/Tool/Modal/ModalSupplier";
import ModalOriginalProduct from "./ModalOriginalProduct/ModalOriginalProduct";
import ModalBrandProduct from "./ModalBrandProduct/ModalBrandProduct";
import ModalTypeProduct from "./ModalTypeProduct/ModalTypeProduct";
import ModalUnitProduct from "./ModalUnitProduct/ModalUnitProduct";
import TabPane from "antd/es/tabs/TabPane";
import TabDetail from "./TabDetail/TabDetail";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type Props = {
  refBtnProduct?: Ref<HTMLButtonElement>;
};

const ModalAddProduct = ({ refBtnProduct }: Props) => {
  const [listDetail, setListDetail] = useState<IGetListDetail[]>([]);
  const refBtnSupplier = useRef<HTMLButtonElement>();
  const refBtnBrand = useRef<HTMLButtonElement>();
  const refBtnOriginal = useRef<HTMLButtonElement>();
  const refBtnUnit = useRef<HTMLButtonElement>();
  const refBtnType = useRef<HTMLButtonElement>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { postdata } = usePostData();
  const { datas: dataTypes } = useSelector(
    (state: RootState) => state.type_product
  );
  const { datas: dataBrands } = useSelector(
    (state: RootState) => state.brand_product
  );
  const { datas: dataOriginals } = useSelector(
    (state: RootState) => state.original_product
  );
  const { datas: dataProfits } = useSelector(
    (state: RootState) => state.get_profits
  );
  const { datas: dataSupplier } = useSelector(
    (state: RootState) => state.get_supplier
  );
  const { datas: dataUnits } = useSelector(
    (state: RootState) => state.unit_product
  );
  const { datas: dataVats } = useSelector(
    (state: RootState) => state.vat_system
  );
  const [form] = useForm();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleSubmit = async (values: ProductInfo) => {
    const dataImg = fileList.map((dt) => dt.originFileObj as File);
    const data = { ...values, images: dataImg, details: listDetail ?? [] };
    const formData = CustomFormData(data);
    try {
      const statusCode = await postdata(() =>
        productService.createProduct(formData)
      );
      if (statusCode === 201) {
        dispatch(fetchProductInfos());
        dispatch(fetchProductAbout());
        form.resetFields();
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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
        hidden={refBtnProduct ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnProduct}
      >
        Thêm sản phẩm
      </Button>
      <Modal
        title="Tạo sản phẩm"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin sản phẩm" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}
            >
              <Form.Item
                name="name"
                className="!m-0"
                label="Tên sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                ]}
                style={{ width: "100%" }}
              >
                <Input placeholder="Tên sản phẩm" />
              </Form.Item>
              <Form.Item
                name="code_original"
                className="!m-0"
                label="Mã sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập mã sản phẩm!" },
                ]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Input placeholder="Mã sản phẩm" />
              </Form.Item>
              <Form.Item
                name="supplier_product"
                className="!m-0"
                label="Nhà cung cấp"
                // rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
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
                name="type"
                className="!m-0"
                label="Loại sản phẩm"
                // rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
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
                          refBtnType.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataTypes?.map((dt) => (
                    <Option key={dt.type_product_id} value={dt.type_product_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="price"
                className="!m-0 flex"
                label="Giá trị"
                rules={[{ required: true, message: "Vui lòng nhập giá trị!" }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <InputNumber defaultValue={0} className="w-full" />
              </Form.Item>
              <Form.Item
                name="warranty"
                className="!m-0 flex"
                label="Bảo hành(*tháng)"
                rules={[{ required: true, message: "Vui lòng nhập giá trị!" }]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <InputNumber defaultValue={0} className="w-full" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Mô tả"
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
                name="vat"
                className="!m-0"
                label="Thuế"
                // rules={[{ required: true, message: "Vui lòng chọn loại thuế!" }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn loại thuế"
                  showSearch
                  filterOption={(input, option) => {
                    return (option?.children?.join("") ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                >
                  {dataVats?.map((dt) => (
                    <Option key={dt.vat_id} value={dt.vat_id}>
                      {dt.type_vat}%
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="brand"
                className="!m-0"
                label="Thương hiệu"
                // rules={[{ required: true, message: "Vui lòng chọn loại thuế!" }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn loại thương hiệu"
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
                          refBtnBrand.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataBrands?.map((dt) => (
                    <Option key={dt.brand_id} value={dt.brand_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="original"
                className="!m-0"
                label="Xuất xứ"
                // rules={[{ required: true, message: "Vui lòng chọn loại thuế!" }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn loại xuất xứ"
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
                          refBtnOriginal.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataOriginals?.map((dt) => (
                    <Option key={dt.original_id} value={dt.original_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="profit"
                className="!m-0"
                label="Lợi nhuận"
                // rules={[{ required: true, message: "Vui lòng chọn loại thuế!" }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn loại lợi nhuận"
                  showSearch
                  filterOption={(input, option) => {
                    return (option?.children?.join("") ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                >
                  {dataProfits?.map((dt) => (
                    <Option key={dt.profit_id} value={dt.profit_id}>
                      {dt.type_profit}%
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="unit_product"
                className="!m-0"
                label="Đơn vị sản phẩm"
                // rules={[{ required: true, message: "Vui lòng chọn loại thuế!" }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn loại đơn vị"
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
                          refBtnUnit.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataUnits?.map((dt) => (
                    <Option key={dt.unit_id} value={dt.unit_id}>
                      {dt.name_unit}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                // name="images"
                label="Ảnh sản phẩm"
                // valuePropName="fileList"
                // getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                className="!m-0"
                // rules={[{ required: false, message: "Vui lòng chọn loại thuế!" }]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Upload
                  action=""
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  multiple
                >
                  {fileList.length >= 5 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    alt="ha"
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Thông số kỹ thuật" key={2}>
            <TabDetail data={listDetail} setData={setListDetail} />
          </TabPane>
        </Tabs>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              form.submit();
            }}
          >
            Tạo
          </Button>
        </div>
      </Modal>
      <ModalAddSupplier
        refBtnSupplier={refBtnSupplier as Ref<HTMLButtonElement>}
      />
      <ModalOriginalProduct
        refBtnOriginal={refBtnOriginal as Ref<HTMLButtonElement>}
      />
      <ModalBrandProduct refBtnBrand={refBtnBrand as Ref<HTMLButtonElement>} />
      <ModalTypeProduct refBtnType={refBtnType as Ref<HTMLButtonElement>} />
      <ModalUnitProduct refBtnUnit={refBtnUnit as Ref<HTMLButtonElement>} />
    </>
  );
};

export default ModalAddProduct;
