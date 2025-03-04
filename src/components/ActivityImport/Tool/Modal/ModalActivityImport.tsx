// import usePostData from "@/hooks/usePostData";
import ModalAddActivity from "@/components/Activity/Tool/Modal/ModalActivity";
import ModalAddProduct from "@/components/Product/ToolProduct/ModalProduct/ModalAddProduct";
import {
  ICreateActivityContainer,
  IGetProductInfo,
} from "@/models/productInterface";
import { fetchActivityContainers } from "@/redux/store/slices/productSlices/get_activity_container.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import productService from "@/services/productService";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  QRCode,
  Select,
  Table,
  Tabs,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import { ColumnsType } from "antd/es/table";
import TabPane from "antd/es/tabs/TabPane";
import React, { Ref, useRef, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

// type Props = {}

export default function ModalAddActivityImport() {
  const [form] = useForm();
  const refBtnProduct = useRef<HTMLButtonElement>();
  const refBtnActivity = useRef<HTMLButtonElement>();
  // const { postdata } = usePostData();
  const [listProducts, setListProducts] = useState<
    ICreateActivityContainer["list_product"]
  >([]);
  const { datas: dataProducts } = useSelector(
    (state: RootState) => state.info_products
  );

  const { datas: dataActivities } = useSelector(
    (state: RootState) => state.get_activities
  );

  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );
  const dispatch = useDispatch<AppDispatch>();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [valuesQR, setValuesQR] = useState<
    { product: IGetProductInfo; list_code: string[] }[]
  >([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: ICreateActivityContainer) => {
    const res = await productService.createActivityContainer({
      ...values,
      type: "import",
      list_product: listProducts,
    });

    if (res.statusCode === 200 || res.statusCode === 201) {
      setValuesQR(res.data);
      dispatch(fetchActivityContainers("import"));
      setIsModalVisible(false);
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };

  const handlePushProduct = (e: string) => {
    setListProducts((preValue) => {
      if (preValue) {
        const check = preValue.find((dt) => dt.product === e);
        if (check) {
          return preValue.map((dt) => {
            if (dt.product === e) {
              return { ...dt, quantity: dt.quantity + 1 }; // Update the matching item
            }
            return dt; // Return unchanged items
          });
        } else {
          const productData = dataProducts.find((dt) => dt.product_id === e);
          return [
            ...preValue,
            { price: productData?.price || 0, product: e, quantity: 1 }, // Add the new product with default price fallback
          ];
        }
      }
    });
  };

  const columns: ColumnsType<{
    quantity: number;
    price: number;
    product: string;
  }> = [
    {
      title: "Mã sản phẩm",
      dataIndex: "product",
      key: "product",
      render: (value, record, index) => (
        <div className="flex gap-1 items-center">
          #{index + 1}.{value}
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      width: "25%",
      key: "name_product",
      render: (value) => {
        return (
          <>
            <strong className="flex gap-2 items-center">
              {dataProducts.find((dt) => dt.product_id === value)?.name}
            </strong>
          </>
        );
      },
    },
    {
      title: "Giá nhập",
      dataIndex: "price",
      width: "25%",
      key: "price",
      render: (value, record, index) => {
        return (
          <>
            <InputNumber
              placeholder="Giá"
              onChange={(e) => {
                setListProducts((prev) => {
                  return prev?.map((dt, i) => {
                    if (i === index) {
                      return { ...dt, price: e };
                    }
                    return dt;
                  });
                });
              }}
              className="w-full"
              defaultValue={value}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
            />
          </>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: "25%",
      key: "quantity",
      render: (value, record, index) => {
        return (
          <>
            <InputNumber
              placeholder="Số lượng"
              onChange={(e) => {
                setListProducts((prev) => {
                  return prev?.map((dt, i) => {
                    if (i === index) {
                      return { ...dt, quantity: e };
                    }
                    return dt;
                  });
                });
              }}
              className="w-full"
              value={value}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
            />
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "product",
      width: "",
      key: "index",
      render: (value, record, index) => {
        return (
          <>
            <Button
              onClick={() => {
                setListProducts((preValue) => {
                  const data = preValue?.filter((dt, i) => i !== index);
                  return data;
                });
              }}
              danger
              className="text-xl"
              icon={<MdDeleteForever />}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <Button
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
      >
        Nhập kho
      </Button>
      <Modal
        title="Nhập kho"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin nhập kho" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: "12px",
                rowGap: "6px",
              }}
            >
              <Form.Item
                name="activity"
                className="!m-0"
                label="Hoạt động"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn hoạt động"
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
                          refBtnActivity.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataActivities?.map((dt) => (
                    <Option key={dt.activity_id} value={dt.activity_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="user"
                className="!m-0"
                label="Nhân viên"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
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
                      {dt.first_name + " " + dt.last_name}
                    </Option>
                  ))}
                </Select>
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
            </Form>
          </TabPane>
          <TabPane tab="Thông tin sản phẩm" key={2}>
            <Select
              className="mb-4 min-w-40"
              placeholder="Chọn sản phẩm thêm"
              onChange={(e) => {
                handlePushProduct(e);
              }}
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
                      refBtnProduct.current?.click();
                    }}
                  >
                    + Thêm tùy chọn mới
                  </Button>
                </>
              )}
            >
              {dataProducts?.map((dt) => (
                <Option key={dt.product_id} value={dt.product_id}>
                  {dt.name}
                </Option>
              ))}
            </Select>

            <div className="border-t-2 w-full overflow-x-auto">
              <div className="w-full">
                <Table<{ price: number; quantity: number; product: string }>
                  columns={columns}
                  scroll={{ x: "max-content" }}
                  className="custom-table"
                  // rowSelection={rowSelection}
                  dataSource={listProducts}
                  pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                  }}
                  showSorterTooltip={{ target: "sorter-icon" }}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>

        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Tạo mã
          </Button>
        </div>
      </Modal>
      <Modal
        title="Mã code"
        open={valuesQR?.length > 0}
        onCancel={() => {
          setValuesQR([]);
        }}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <div className="flex gap-8 flex-col">
          {valuesQR.map((dt) => {
            return (
              <>
                <p className="my-4 text-xl font-semibold">{dt.product.name}:</p>
                <div className="flex gap-8 flex-wrap justify-center">
                  {dt.list_code.map((dtt) => {
                    return (
                      <>
                        <div className="flex flex-col items-center justify-center gap-2">
                          <QRCode value={dtt} />
                          <p className="text-xs font-medium">{dtt}</p>
                        </div>
                      </>
                    );
                  })}
                </div>
              </>
            );
          })}
        </div>
      </Modal>
      <ModalAddProduct
        refBtnProduct={refBtnProduct as Ref<HTMLButtonElement>}
      />
      <ModalAddActivity
        refBtnActivity={refBtnActivity as Ref<HTMLButtonElement>}
      />
    </>
  );
}
