"use client";
import React, { Ref, useState } from "react";
import { Button, Form, Input, Modal, Select, Table } from "antd";
import usePostData from "@/hooks/usePostData";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import { IoIosAdd } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ITypeProduct } from "@/models/productInterface";
import productService from "@/services/productService";
import { fetchProductTypes } from "@/redux/store/slices/productSlices/get_type.slice";
import { fetchProductInfos } from "@/redux/store/slices/productSlices/get_products";
import { Option } from "antd/es/mentions";
type Props = {
  refBtnType?: Ref<HTMLButtonElement>;
};
const ModalTypeProduct = ({ refBtnType }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [indexEdit, setIndexEdit] = useState<number>(-1);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataTypeProducts } = useSelector(
    (state: RootState) => state.type_product
  );

  const { datas: dataClassifyType } = useSelector(
    (state: RootState) => state.get_classify_type
  );

  const handlePushIndex = (index: number) => {
    setIndexEdit(index);
    formTypeEdit.setFieldsValue(dataTypeProducts?.[index]);
  };

  // const [dataSource, setDataSource] = useState<ITypeProduct[] | []>([]);
  const [tabFormType, setTabFormType] = useState<boolean>(false);
  const { postdata } = usePostData();
  const [formType] = useForm();
  const [formTypeEdit] = useForm();

  // useEffect(() => {
  //   console.log(dataSource);
  // }, [dataSource]);
  const columns: ColumnsType<ITypeProduct> = [
    {
      title: "Tag loại",
      dataIndex: "name_tag",
      width: "20%",
      key: "name_tag",
      render: (value) => {
        return (
          <>
            <strong className="flex gap-2 items-center">{value}</strong>
          </>
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: "30%",
      key: "description",
      render: (value) => {
        return (
          <>
            <strong className="flex gap-2 items-center">{value}</strong>
          </>
        );
      },
    },
    {
      title: "Phân loại",
      dataIndex: "classify_type",
      width: "30%",
      key: "classify_type",
      render: (value) => {
        return (
          <>
            <strong className="flex gap-2 items-center">
              {dataClassifyType.find((dt) => dt.classify_id === value)?.name}
            </strong>
          </>
        );
      },
    },
    {
      title: "Tên loại",
      dataIndex: "name",
      width: "40%",
      key: "name",
      render: (value, record, index) => {
        return (
          <>
            <strong className="flex gap-2 items-center">
              {value}

              <Button
                type="link"
                onClick={() => {
                  handlePushIndex(index);
                }}
                icon={<CiEdit />}
              />
            </strong>
          </>
        );
      },
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: ITypeProduct) => {
    console.log(values);
    try {
      const statusCode = await postdata(() =>
        productService.createType(values)
      );

      if (statusCode === 201) {
        dispatch(fetchProductTypes());
        formType.resetFields();
        setTabFormType(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  const handleSubmitEdit = async (values: ITypeProduct) => {
    try {
      console.log(values);
      const statusCode = await postdata(() =>
        productService.updateType(
          dataTypeProducts?.[indexEdit ?? 0].type_product_id ?? "",
          values
        )
      );
      if (statusCode === 200) {
        dispatch(fetchProductTypes());
        dispatch(fetchProductInfos());
        setIndexEdit(-1);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  return (
    <>
      <Button
        hidden={refBtnType ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        onClick={showModal}
        ref={refBtnType}
      >
        Loại sản phẩm
      </Button>
      <Modal
        title={
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span>Loại sản phẩm</span>
            <Button
              className="text-white font-semibold bg-orange-500"
              icon={<IoIosAdd />}
              type="default"
              onClick={() => {
                formType.resetFields();
                setTabFormType(!tabFormType);
              }}
            />
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <div className="flex flex-col gap-2">
          <div
            className="bg-slate-200 px-1 py-2 rounded-md"
            hidden={!tabFormType}
          >
            <Form
              form={formType}
              onFinish={handleSubmit}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên loại" />
              </Form.Item>
              <Form.Item
                name="name_tag"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tag loại",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tag loại" />
              </Form.Item>

              <Form.Item
                name="classify_type"
                style={{ width: "100%", flex: "1 1 0%", margin: "0" }}
              >
                <Select
                  placeholder="Chọn phân loại"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {dataClassifyType?.map((dt) => (
                    <Option key={dt.classify_id} value={dt.classify_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0", minWidth: "100%" }}
              >
                <Input.TextArea
                  // className="m-0"
                  autoSize={{ minRows: 1 }}
                  placeholder="Nhập mô tả"
                />
              </Form.Item>
              <Form.Item
                style={{
                  display: "flex",
                  minWidth: "100%",
                  justifyContent: "end",
                  margin: "0",
                }}
              >
                <Button
                  className="bg-green-500 text-white font-semibold"
                  onClick={() => {
                    formType.submit();
                  }}
                >
                  Thêm
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div
            className="bg-slate-200 px-1 py-2 rounded-md"
            hidden={!(indexEdit > -1)}
          >
            <Form
              form={formTypeEdit}
              onFinish={handleSubmitEdit}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên loại" />
              </Form.Item>
              <Form.Item
                name="name_tag"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tag loại",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tag loại" />
              </Form.Item>

              <Form.Item
                name="classify_type"
                style={{ width: "100%", flex: "1 1 0%", margin: "0" }}
              >
                <Select
                  placeholder="Chọn phân loại"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {dataClassifyType?.map((dt) => (
                    <Option key={dt.classify_id} value={dt.classify_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0", minWidth: "100%" }}
              >
                <Input.TextArea
                  // className="m-0"
                  autoSize={{ minRows: 1 }}
                  placeholder="Nhập mô tả"
                />
              </Form.Item>
              <Form.Item
                style={{
                  display: "flex",
                  minWidth: "100%",
                  gap: "2px",
                  justifyContent: "end",
                  margin: "0",
                }}
              >
                <Button
                  className="bg-yellow-500 text-white font-semibold"
                  htmlType="submit"
                >
                  Cập nhật
                </Button>
                <Button
                  className="bg-red-500 text-white font-semibold"
                  onClick={() => {
                    setIndexEdit(-1);
                  }}
                >
                  Huỷ
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="border-t-2 w-full overflow-x-auto">
            <div className="w-full">
              <Table<ITypeProduct>
                columns={columns}
                scroll={{ x: "max-content" }}
                className="custom-table"
                // rowSelection={rowSelection}
                dataSource={dataTypeProducts}
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
      </Modal>
    </>
  );
};

export default ModalTypeProduct;
