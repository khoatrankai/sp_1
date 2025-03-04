// components/QRCodeScanner.js
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
// import QrReader from "react-qr-reader";
import { BiQrScan } from "react-icons/bi";
import {
  ICreateActivityContainer,
  IGetCodeProduct,
  IGetProductInfo,
} from "@/models/productInterface";
import { ColumnsType } from "antd/es/table";
import productService from "@/services/productService";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Option } from "antd/es/mentions";
import TabPane from "antd/es/tabs/TabPane";
import { useForm } from "antd/es/form/Form";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import usePostData from "@/hooks/usePostData";
import { useDispatch } from "react-redux";
import { fetchActivityContainers } from "@/redux/store/slices/productSlices/get_activity_container.slice";
import { MdDeleteForever } from "react-icons/md";
// import { toast } from "react-toastify";

const ModalAddActivityStatus = () => {
  const { datas: dataActivities } = useSelector(
    (state: RootState) => state.get_activities
  );

  const { postdata } = usePostData();

  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );

  const { datas: dataCustomers } = useSelector(
    (state: RootState) => state.infos_customer
  );

  const dispatch = useDispatch<AppDispatch>();
  const [startScan, setStartScan] = useState(false);
  const [tabConfirm, setTabConfirm] = useState(false);
  const [scanText, setScanText] = useState<string | undefined>();
  const [listProduct, setListProduct] = useState<IGetProductInfo[]>([]);
  const [dataSource, setDataSource] = useState<IGetCodeProduct[]>([]);
  const handleScan = (scanData: string) => {
    if (scanData && scanData !== "") {
      setScanText(scanData);
    }
  };
  useEffect(() => {
    const fetchDataCode = async (code: string) => {
      const res = await productService.getCodeStatusByURL(code);
      if (res)
        if (res.statusCode === 200) {
          const checkProduct = listProduct.find(
            (dt) => dt.product_id === res.data.product.product_id
          );
          if (!checkProduct) {
            setListProduct((preValue) => {
              return [
                ...preValue,
                {
                  ...res.data.product,
                },
              ];
            });
          }

          setDataSource([{ ...res.data, status: "inventory" }, ...dataSource]);
        }
      setScanText("");
    };
    if (scanText && scanText !== "") {
      const check = dataSource?.find((dt) => {
        return dt.code.includes(scanText);
      });
      if (!check) {
        fetchDataCode(scanText);
      }
    }
  }, [scanText]);

  const [form] = useForm();

  const handleCancel = async () => {
    setDataSource([]);
    setStartScan(false);
    setListProduct([]);
    setScanText("");
    setTabConfirm(false);
  };
  const options: { key: string; value: string; label: string }[] = [
    { key: "inventory", value: "inventory", label: "Kho" },
    { key: "export", value: "export", label: "Xuất kho" },
    { key: "warranty", value: "warranty", label: "Bảo hành" },
    { key: "maintenance", value: "maintenance", label: "Bảo trì" },
  ];
  const handleSubmit = async (values: ICreateActivityContainer) => {
    const res = await postdata(() =>
      productService.createActivityContainer({
        ...values,
        type: "status",
        list_code:
          dataSource.map((dt) => {
            return {
              code: dt.code ?? "",
              price:
                listProduct.find(
                  (dtt) => dtt.product_id === dt.product.product_id
                )?.price ?? 0,
              status: dt.status,
            };
          }) ?? [],
      })
    );

    if (res === 201) {
      dispatch(fetchActivityContainers("status"));
      handleCancel();
    }
  };

  const columns: ColumnsType<IGetCodeProduct> = [
    {
      title: "ID CODE",
      dataIndex: "code_product_id",
      key: "code_product_id",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: ["product", "name"],
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record, index) => {
        return (
          <>
            <Select
              placeholder="Chọn loại"
              className="w-24"
              onChange={(e) => {
                setDataSource((preValue) => {
                  return preValue.map((dt, i) => {
                    if (i === index) {
                      return {
                        ...dt,
                        status: e as
                          | "selled"
                          | "borrowed"
                          | "inventory"
                          | "export"
                          | "warranty"
                          | "maintenance",
                      };
                    }
                    return dt;
                  });
                });
              }}
              showSearch
              filterOption={(input, option) => {
                return (option?.children?.join("") ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
            >
              {options.map((option) => (
                <Option key={option.key} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "",
      width: "",
      key: "",
      render: (value, record, index) => {
        return (
          <>
            <Button
              onClick={() => {
                setDataSource((preValue) => {
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

  const columnsConfirm: ColumnsType<IGetProductInfo> = [
    // {
    //   title: "ID Sản phẩm",
    //   dataIndex: "product_id",
    //   key: "product_id",
    // },
    {
      title: "Nhà cung ứng",
      dataIndex: ["supplier_product", "name"],
      key: "name_supplier",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: ["name"],
      key: "name",
    },
    {
      title: "Đơn giá",
      dataIndex: ["price"],
      key: "price",
      render: (value, record, index) => {
        return (
          <>
            <InputNumber
              placeholder="Giá"
              onChange={(e) => {
                setListProduct((prev) => {
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
      title: "Loại sản phẩm",
      dataIndex: ["type", "name"],
      key: "type_name",
    },
    {
      title: "Đơn vị",
      dataIndex: ["unit_product", "name_unit"],
      key: "name_unit",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (value, record) => {
        return (
          <>
            {
              dataSource.filter((dt) => {
                return record.product_id === dt.product.product_id;
              }).length
            }
          </>
        );
      },
    },
  ];
  return (
    <>
      <Button
        onClick={() => {
          setStartScan(!startScan);
        }}
        icon={<BiQrScan />}
      >
        Cập nhật trạng thái
      </Button>

      {startScan && (
        <>
          <Modal
            title="Quét xuất sản phẩm"
            open={startScan}
            onCancel={handleCancel}
            footer={null}
            width={"100%"}
            style={{ maxWidth: "1000px" }}
          >
            <div className="flex flex-wrap">
              <div className="w-72 h-72">
                <Scanner
                  onScan={(e) => {
                    // setStartScan(false);
                    // console.log(e);
                    if (e.length > 0) handleScan(e[0].rawValue);
                  }}
                />
              </div>
              <Table<IGetCodeProduct>
                columns={columns}
                className="flex-1 min-w-96"
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
            <div
              className="flex justify-end w-full"
              onClick={() => {
                setTabConfirm(true);
              }}
            >
              <Button
                type="primary"
                disabled={!(listProduct.length > 0)}
                className="bg-[#E46D03]"
              >
                Cập nhật trạng thái
              </Button>
            </div>
            <Modal
              title="Thông tin xuất kho"
              open={tabConfirm}
              onCancel={() => {
                setTabConfirm(false);
              }}
              footer={null}
              width={"100%"}
              style={{ maxWidth: "1000px" }}
            >
              <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
                <TabPane tab="Thông tin xuất" key={1}>
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
                          return (option?.children?.join("") ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase());
                        }}
                      >
                        {dataActivities?.map((dt) => (
                          <Option key={dt.activity_id} value={dt.activity_id}>
                            {dt.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="customer"
                      className="!m-0"
                      label="Khách hàng"
                      style={{ minWidth: "320px", flex: "1 1 0%" }}
                    >
                      <Select
                        placeholder="Chọn khách hàng"
                        showSearch
                        filterOption={(input, option) => {
                          return (option?.children?.join("") ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase());
                        }}
                      >
                        {dataCustomers?.map((dt) => (
                          <Option key={dt.info_id} value={dt.info_id}>
                            {dt.name_company}
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
                          return (option?.children?.join("") ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase());
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
                <TabPane tab="Sản phẩm xuất" key={2}>
                  <Table<IGetProductInfo>
                    columns={columnsConfirm}
                    scroll={{ x: "max-content" }}
                    className="flex-1 min-w-96"
                    dataSource={listProduct}
                    pagination={{
                      pageSize: 10,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    showSorterTooltip={{ target: "sorter-icon" }}
                  />
                </TabPane>
              </Tabs>

              <div className="flex justify-end w-full ">
                <Button
                  className="bg-[#02B39A]"
                  onClick={() => {
                    form.submit();
                  }}
                >
                  Xác nhận
                </Button>
              </div>
            </Modal>
          </Modal>
        </>
      )}
    </>
  );
};

export default ModalAddActivityStatus;
