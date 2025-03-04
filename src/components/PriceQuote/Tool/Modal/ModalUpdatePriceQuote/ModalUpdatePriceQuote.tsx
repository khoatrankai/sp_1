/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from "@/hooks/usePostData";
import { ICreatePriceQuote } from "@/models/priceQuoteInterface";
import { IGetProductInfo } from "@/models/productInterface";
import "./styles.scss";
import { RootState } from "@/redux/store/store";
import priceQuoteService from "@/services/priceQuoteService";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tabs,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import { ColumnsType } from "antd/es/table";
import TabPane from "antd/es/tabs/TabPane";
import { Moment } from "moment";
import React, { Ref, useEffect, useRef, useState } from "react";
import { MdDelete, MdNoteAdd } from "react-icons/md";
import { useSelector } from "react-redux";
import ModalAddProject from "@/components/Project/Tool/Modal/ModalAddProject";
import dayjs from "dayjs";

type Props = {
  ID: string;
};

export default function ModalUpdatePriceQuote({ ID }: Props) {
  const refBtnProject = useRef<HTMLButtonElement>();
  const [checkType,setCheckType] = useState<boolean>(false)
  const { datas: dataVats } = useSelector(
    (state: RootState) => state.vat_system
  );
  const { datas: dataProjects } = useSelector(
    (state: RootState) => state.get_projects
  );
  const { datas: dataCustomers } = useSelector(
    (state: RootState) => state.infos_customer
  );
  const { datas: dataProducts } = useSelector(
    (state: RootState) => state.info_products
  );
  const { datas: dataUnits } = useSelector(
    (state: RootState) => state.unit_product
  );
  const { datas: dataProfits } = useSelector(
    (state: RootState) => state.get_profits
  );
  const { datas: dataTypePackages } = useSelector(
    (state: RootState) => state.type_package
  );
  // const [tabFormProduct, setTabFormProduct] = useState<boolean>(false);
  // const [dataSource, setDataSource] = useState<IGetProductInfo[] | []>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [typeDiscount, setTypeDiscount] = useState<string | undefined>(
    "percent"
  );
  const [typeVat, setTypeVat] = useState<string | undefined>("none");
  const [priceTotal, setPriceTotal] = useState<number>(0);
  const [listPart, setListPart] = useState<
    {
      title: string;
      products: IGetProductInfo[];
      type_package: string | undefined;
    }[]
  >([]);
  const [priceDiscount, setPriceDiscount] = useState<number>(0);
  const [priceVat, setPriceVat] = useState<number>(0);
  const selectAfter = (
    <Select
      defaultValue="percent"
      onChange={(e) => {
        setTypeDiscount(e);
      }}
    >
      <Option value="percent">%</Option>
      <Option value="money">vnđ</Option>
    </Select>
  );
  const customColumns = (index: number) => {
    const columns: ColumnsType<IGetProductInfo> = [
      {
        title: "Loại sản phẩm",
        dataIndex: ["type", "name"],
        key: "type",
        render: (value, record, i) => (
          <div className="flex gap-1 items-center">
            {record.name && (
              <MdNoteAdd
                className="cursor-pointer text-lg"
                onClick={() => {
                  handleAddDetail(index, i);
                }}
              />
            )}

            {value}
          </div>
        ),
      },
      // {
      //   title: "Mã sản phẩm",
      //   dataIndex: "product_id",
      //   key: "product_id",
      // },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        render: (value, record, i) => {
          return record.name ? (
            <>
              <p>{value?.length > 20 ? `${value.slice(0, 20)}...` : value}</p>
            </>
          ) : (
            <>
              <Input.TextArea
                placeholder="Mô tả chi tiết"
                value={value}
                onChange={(e) => {
                  setListPart((preValue) => {
                    return preValue.map((dt, iPart) => {
                      if (iPart === index) {
                        return {
                          ...dt,
                          products: dt.products.map((dtt, iProduct) => {
                            if (iProduct === record?.ikey) {
                              return {
                                ...dtt,
                                children: dtt.children?.map((dttt, iChil) => {
                                  if (iChil === i) {
                                    return {
                                      ...dttt,
                                      description: e.target.value,
                                    };
                                  }
                                  return dttt;
                                }),
                              };
                            }
                            return dtt;
                          }),
                        };
                      }
                      return dt;
                    });
                  });
                }}
                autoSize={{ minRows: 1 }}
              />
            </>
          );
        },
      },
      {
        title: "Đơn vị",
        dataIndex: "unit",
        key: "unit",
        width: "100px",
        render: (value, record, i) => {
          if (record.name) {
            return <>{record?.unit_product?.name_unit}</>;
          }
          return (
            <Select
              placeholder="Chọn đơn vị"
              showSearch
              value={value}
              onChange={(e) => {
                setListPart((preValue) => {
                  return preValue.map((dt, iPart) => {
                    if (iPart === index) {
                      return {
                        ...dt,
                        products: dt.products.map((dtt, iProduct) => {
                          if (iProduct === record?.ikey) {
                            return {
                              ...dtt,
                              children: dtt.children?.map((dttt, iChil) => {
                                if (iChil === i) {
                                  return {
                                    ...dttt,
                                    unit: e,
                                  };
                                }
                                return dttt;
                              }),
                            };
                          }
                          return dtt;
                        }),
                      };
                    }
                    return dt;
                  });
                });
              }}
              filterOption={(input, option) => {
                return (option?.children?.join("") ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
            >
              {dataUnits?.map((dt) => (
                <Option key={dt.unit_id} value={dt.unit_id}>
                  {dt.name_unit}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        width: "30px",
        render: (value, record, i) => {
          if (!record.name) {
            return (
              <InputNumber
                min={1}
                value={value}
                onChange={(e) => {
                  setListPart((preValue) => {
                    return preValue.map((dt, iPart) => {
                      if (iPart === index) {
                        return {
                          ...dt,
                          products: dt.products.map((dtt, iProduct) => {
                            if (iProduct === record?.ikey) {
                              return {
                                ...dtt,
                                children: dtt.children?.map((dttt, iChil) => {
                                  if (iChil === i) {
                                    return {
                                      ...dttt,
                                      quantity: e ?? 1,
                                    };
                                  }
                                  return dttt;
                                }),
                              };
                            }
                            return dtt;
                          }),
                        };
                      }
                      return dt;
                    });
                  });
                }}
              />
            );
          }
          // const maxQuantity = record.code_product.filter(
          //   (dt) => dt.status === "inventory"
          // ).length;
          // const currQuantity = listPart.reduce((preValue, currValue) => {
          //   const countProduct =
          //     currValue.products.find(
          //       (dtt) => dtt.product_id === record.product_id
          //     )?.quantity ?? 0;
          //   return countProduct + preValue;
          // }, 0);
          // const quantity =
          //   listPart[index].products.find(
          //     (dtt) => dtt.product_id === record.product_id
          //   )?.quantity ?? 0;
          return (
            <>
              <InputNumber
                onChange={(e) => {
                  // const item = maxQuantity - currQuantity;
                  // if (item > 0 || quantity > e)
                  setListPart((preValue) => {
                    return preValue.map((dt, idt) => {
                      if (idt === index) {
                        return {
                          ...dt,
                          products: dt.products.map((dtt, idtt) => {
                            if (idtt === i) {
                              return { ...dtt, quantity: e };
                            }
                            return dtt;
                          }),
                        };
                      }
                      return dt;
                    });
                  });
                }}
                min={1}
                // disabled={maxQuantity === 0}
                value={value}
                // max={maxQuantity}
              />
            </>
          );
        },
      },
      {
        title: "Giá sản phẩm (VNĐ)",
        dataIndex: "price",
        key: "price",
        width: "120px",
        render: (price, record, i) => (
          <>
            <InputNumber
              placeholder="Giá"
              onChange={(e) => {
                if (!record.name) {
                  setListPart((preValue) => {
                    return preValue.map((dt, iPart) => {
                      if (iPart === index) {
                        return {
                          ...dt,
                          products: dt.products.map((dtt, iProduct) => {
                            if (iProduct === record?.ikey) {
                              return {
                                ...dtt,
                                children: dtt.children?.map((dttt, iChil) => {
                                  if (iChil === i) {
                                    return {
                                      ...dttt,
                                      price: e ?? 1,
                                    };
                                  }
                                  return dttt;
                                }),
                              };
                            }
                            return dtt;
                          }),
                        };
                      }
                      return dt;
                    });
                  });
                } else {
                  setListPart((preValue) => {
                    return preValue.map((dt, idt) => {
                      if (idt === index) {
                        return {
                          ...dt,
                          products: dt.products.map((dtt, idtt) => {
                            if (idtt === i) {
                              return { ...dtt, price: e };
                            }
                            return dtt;
                          }),
                        };
                      }
                      return dt;
                    });
                  });
                }
              }}
              className="w-full"
              value={price}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
            />
          </>
        ),
      },
      // {
      //   title: "Mô tả",
      //   dataIndex: "description",
      //   key: "description",
      // },
      {
        title: "Thuế VAT",
        dataIndex: "vat",
        key: "vat",
        width: "30px",
        render: (value, record, i) => {
          if (!record.name) {
            return;
          }
          return (
            <>
              <Select
                placeholder="Chọn loại thuế"
                showSearch
                defaultValue={value}
                onChange={(e) => {
                  setListPart((preValue) => {
                    return preValue.map((dt, idt) => {
                      if (idt === index) {
                        return {
                          ...dt,
                          products: dt.products.map((dtt, idtt) => {
                            if (idtt === i) {
                              return { ...dtt, vat: e };
                            }
                            return dtt;
                          }),
                        };
                      }
                      return dt;
                    });
                  });
                }}
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
            </>
          );
        },
      },
      {
        title: "Lợi nhuận",
        dataIndex: "profit",
        key: "profit",
        width: "30px",
        render: (value, record, i) => {
          if (!record.name) {
            return;
          }
          return (
            <>
              <Select
                placeholder="Chọn loại thuế"
                showSearch
                defaultValue={value}
                onChange={(e) => {
                  setListPart((preValue) => {
                    return preValue.map((dt, idt) => {
                      if (idt === index) {
                        return {
                          ...dt,
                          products: dt.products.map((dtt, idtt) => {
                            if (idtt === i) {
                              return { ...dtt, profit: e };
                            }
                            return dtt;
                          }),
                        };
                      }
                      return dt;
                    });
                  });
                }}
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
            </>
          );
        },
      },

      {
        title: "",
        dataIndex: "",
        key: "",
        render: (value, record, i) => (
          <div className="flex gap-2 items-center">
            {/* <Button type="primary" className="bg-yellow-500" icon={<MdEdit />} /> */}
            <Button
              type="primary"
              onClick={() => {
                if (record.name) {
                  setListPart((preValue) => {
                    return preValue.map((dt, idt) => {
                      if (idt === index) {
                        return {
                          ...dt,
                          products: dt.products.filter((dtt, idtt) => {
                            return idtt !== i;
                          }),
                        };
                      }
                      return dt;
                    });
                  });
                } else {
                  setListPart((preValue) => {
                    return preValue.map((dt, iPart) => {
                      if (iPart === index) {
                        return {
                          ...dt,
                          products: dt.products.map((dtt, iProduct) => {
                            if (iProduct === record?.ikey) {
                              return {
                                ...dtt,
                                children: dtt.children?.filter(
                                  (dttt, iChil) => {
                                    return iChil !== i;
                                  }
                                ),
                              };
                            }
                            return dtt;
                          }),
                        };
                      }
                      return dt;
                    });
                  });
                }
              }}
              className="bg-red-500"
              icon={<MdDelete />}
            />
          </div>
        ), // Định dạng số thành VNĐ
      },
    ];
    return columns;
  };

  const [form] = useForm();
  const { postdata } = usePostData();

  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
    fetchData();
  };

  const handleAddDetail = (iPart: number, index: number) => {
    setListPart((preValue) => {
      return preValue.map((dt, i) => {
        if (i === iPart) {
          return {
            ...dt,
            products: dt.products.map((dtt, iProduct) => {
              if (iProduct === index) {
                return {
                  ...dtt,
                  key: iProduct,
                  children: dtt.children
                    ? [
                        ...dtt.children,
                        {
                          ikey: index,
                          key:
                            iPart * 10000 +
                            iProduct * 1000 +
                            dtt.children.length +
                            100,
                          description: "",
                          unit: "",
                          quantity: 1,
                          price: 0,
                        },
                      ]
                    : [
                        {
                          ikey: index,
                          key: iPart * 10000 + iProduct * 1000 + 100,
                          description: "",
                          unit: "",
                          quantity: 1,
                          price: 0,
                        },
                      ],
                };
              }
              return dtt;
            }),
          };
        }
        return dt;
      });
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: ICreatePriceQuote) => {
    const res = await postdata(() =>
      priceQuoteService.updatePriceQuote(ID, {
        ...values,
        parts: listPart.map((dt) => {
          return {
            title: dt.title,
            products: dt.products.map((dtt) => {
              return {
                product: dtt.product_id,
                price: dtt.price,
                quantity: dtt.quantity,
                vat: dtt.vat,
                profit: dtt.profit,
                list_detail: dtt.children,
              };
            }),
            type_package: dt.type_package,
          };
        }),
      })
    );
    if (res === 200 || res === 201) {
      setIsModalVisible(false);
    }
  };

  const fetchData = async () => {
    const res = await priceQuoteService.getPriceQuoteID(ID);
    if (res.statusCode === 200) {
     if(res.data.opportunity){
      setCheckType(true)
     }
      setListPart(
        res.data.parts.map((dt: any, iPart: number) => {
          return {
            ...dt,
            products: dt.products.map((dtt: any, iProduct: number) => {
              return {
                ...dtt,
                children: dtt.list_detail.map((dttt: any, iDetail: number) => {
                  return {
                    ...dttt,
                    ikey: iProduct,
                    key: iPart * 10000 + iProduct * 1000 + iDetail + 100,
                  };
                }),
                key: iProduct,
              };
            }),
            type_package: dt?.type_package?.package_id ?? "",
          };
        })
      );
      form.setFieldsValue({
        ...res.data,
      });
    }
  };
  // const handleAddProduct = () => {
  //   formProduct.submit();
  // };

  useEffect(() => {
    if (listPart) {
      const dataSource = listPart.map((dt) => dt.products).flat();
      // console.log(dataSource, listPart);
      const total = dataSource.reduce((preValue, currValue) => {
        const priceProfit =
          currValue.price *
          currValue.quantity *
          ((dataProfits.find((dt) => dt.profit_id === currValue.profit)
            ?.type_profit ?? 0) /
            100);
        return currValue.price * currValue.quantity + priceProfit + preValue;
      }, 0);

      setPriceTotal(total);

      if (typeVat === "before") {
        const totalDiscount =
          typeDiscount === "percent"
            ? dataSource.reduce((preValue, currValue) => {
                const priceProfit =
                  currValue.price *
                  currValue.quantity *
                  ((dataProfits.find((dt) => dt.profit_id === currValue.profit)
                    ?.type_profit ?? 0) /
                    100);
                return (
                  ((currValue.price * currValue.quantity + priceProfit) *
                    discount) /
                    100 +
                  preValue
                );
              }, 0)
            : discount;
        const totalVat =
          typeDiscount === "percent"
            ? dataSource.reduce((preValue, currValue) => {
                const priceProfit =
                  currValue.price *
                  currValue.quantity *
                  ((dataProfits.find((dt) => dt.profit_id === currValue.profit)
                    ?.type_profit ?? 0) /
                    100);
                return (
                  ((currValue.price * currValue.quantity +
                    priceProfit -
                    ((currValue.price * currValue.quantity + priceProfit) *
                      discount) /
                      100) *
                    (dataVats?.find((dt) => dt.vat_id === currValue.vat)
                      ?.type_vat ?? 0)) /
                    100 +
                  preValue
                );
              }, 0)
            : dataSource.reduce((preValue, currValue) => {
                const priceProfit =
                  currValue.price *
                  currValue.quantity *
                  ((dataProfits.find((dt) => dt.profit_id === currValue.profit)
                    ?.type_profit ?? 0) /
                    100);
                return (
                  ((currValue.price * currValue.quantity +
                    priceProfit -
                    ((currValue.price * currValue.quantity + priceProfit) /
                      total) *
                      discount) *
                    (dataVats?.find((dt) => dt.vat_id === currValue.vat)
                      ?.type_vat ?? 0)) /
                    100 +
                  preValue
                );
              }, 0);
        setPriceVat(totalVat);
        setPriceDiscount(totalDiscount);
      } else {
        const totalVat = dataSource.reduce((preValue, currValue) => {
          const priceProfit =
            currValue.price *
            currValue.quantity *
            ((dataProfits.find((dt) => dt.profit_id === currValue.profit)
              ?.type_profit ?? 0) /
              100);
          return (
            ((currValue.price * currValue.quantity + priceProfit) *
              (dataVats?.find((dt) => dt.vat_id === currValue.vat)?.type_vat ??
                0)) /
              100 +
            preValue
          );
        }, 0);
        const totalDiscount =
          typeDiscount === "percent"
            ? dataSource.reduce((preValue, currValue) => {
                const priceProfit =
                  currValue.price *
                  currValue.quantity *
                  ((dataProfits.find((dt) => dt.profit_id === currValue.profit)
                    ?.type_profit ?? 0) /
                    100);
                return (
                  ((currValue.price * currValue.quantity +
                    priceProfit -
                    ((currValue.price * currValue.quantity + priceProfit) *
                      (dataVats?.find((dt) => dt.vat_id === currValue.vat)
                        ?.type_vat ?? 0)) /
                      100) *
                    discount) /
                    100 +
                  preValue
                );
              }, 0)
            : discount;
        setPriceVat(totalVat);
        setPriceDiscount(totalDiscount);
      }
    }
  }, [listPart, typeDiscount, typeVat, discount]);

  const handlePush = async (index: number, data?: IGetProductInfo) => {
    if (data) {
      // const maxQuantity = data.code_product.filter(
      //   (dt) => dt.status === "inventory"
      // ).length;
      // const currQuantity = listPart.reduce((preValue, currValue) => {
      //   const countProduct =
      //     currValue.products.find((dtt) => dtt.product_id === data.product_id)
      //       ?.quantity ?? 0;
      //   return countProduct + preValue;
      // }, 0);
      // if (currQuantity < maxQuantity) {
      setListPart((preValue) => {
        return preValue.map((dt, idt: number) => {
          if (idt === index) {
            const check = dt.products.find(
              (dtt) => dtt.product_id === data.product_id
            );
            if (check) {
              return {
                ...dt,
                products: dt.products.map((dtt) => {
                  if (dtt.product_id === data.product_id) {
                    return { ...dtt, quantity: dtt.quantity + 1 };
                  }
                  return dtt;
                }),
              };
            } else {
              return {
                ...dt,
                products: [...dt.products, { ...data, quantity: 1 }],
              };
            }
          }
          return dt;
        });
      });
      // }
    }
  };

  const handlePushPart = async () => {
    setListPart((preValue) => {
      return [...preValue, { title: "", products: [], type_package: "" }];
    });
  };
  const handleChangeTypePackage = async (
    index: number,
    value: string | undefined
  ) => {
    setListPart((preValue) => {
      return preValue.map((dt, idt) => {
        if (idt === index) {
          return { ...dt, type_package: value };
        }
        return dt;
      });
    });
  };
  const btnSubmit = async () => {
    form.submit();
  };

  const handleChangeTitle = async (index: number, value: string) => {
    setListPart((preValue) => {
      return preValue.map((dt, idt) => {
        if (idt === index) {
          return { ...dt, title: value };
        }
        return dt;
      });
    });
  };

  return (
    <>
      <Button
        className="  text-xs text-yellow-500 font-semibold"
        type="text"
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Cập nhật báo giá"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "1000px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin báo giá" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >{
              !checkType ?
              <Form.Item
              name="project"
              label="Dự án báo giá"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn dự án!",
                },
              ]}
              style={{ minWidth: "240px", flex: "1 1 0%" }}
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
                {dataProjects?.map((dt) => (
                  <Option key={dt.project_id} value={dt.project_id}>
                    {dt.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>:
             <Form.Item
             name="customer"
             label="Khách hàng"
             
             style={{ minWidth: "240px", flex: "1 1 0%" }}
           >
             <Select
                disabled
               filterOption={(input, option) => {
                 const text = Array.isArray(option?.children)
                   ? option.children.join("")
                   : option?.children ?? "";
                 return text.toLowerCase().includes(input.toLowerCase());
               }}
              
             >
               {dataCustomers?.map((dt) => (
                 <Option key={dt.info_id} value={dt.info_id}>
                   {dt.name_company}
                 </Option>
               ))}
             </Select>
           </Form.Item>
            }
             
              <Form.Item
                name="reference_code"
                label="Mã tham chiếu"
                // rules={[
                //   {
                //     required: true,
                //     type: "string",
                //     message: "Vui lòng nhập mã tham chiếu",
                //   },
                // ]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="type_vat"
                label="Loại thuế"
                // rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Select discount type"
                  defaultValue={"none"}
                  onChange={(e) => {
                    setTypeVat(e);
                  }}
                >
                  <Option value="none">None</Option>
                  <Option value="before">Before</Option>
                  <Option value="after">After</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="type_money"
                label="Đơn vị tiền"
                // rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select placeholder="Select a currency type">
                  <Option value="vnd">VND</Option>
                  <Option value="usd">USD</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="user_support"
                label="Người phụ trách"
                // rules={[{ required: true }]}
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
                name="date_start"
                label="Ngày bắt đầu"
                // rules={[{ required: true }]}
                initialValue=""
                className=" mb-0"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
                getValueFromEvent={(e: Moment) => e?.format("YYYY-MM-DD")}
                getValueProps={(e: string) => ({
                  value: e ? dayjs(e) : "",
                })}
              >
                <DatePicker
                  placeholder="Chọn ngày bắt đầu"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                name="date_expired"
                label="Ngày kết thúc"
                rules={[{ required: true }]}
                initialValue=""
                className=" mb-0"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
                getValueFromEvent={(e: Moment) => e?.format("YYYY-MM-DD")}
                getValueProps={(e: string) => ({
                  value: e ? dayjs(e) : "",
                })}
              >
                <DatePicker
                  placeholder="Chọn ngày kết thúc"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Thông tin sản phẩm" key={2}>
            <Button type="primary" className="mb-4" onClick={handlePushPart}>
              Thêm thành phần
            </Button>
            {listPart.length > 0 && (
              <div className="flex gap-2 flex-col p-2 bg-[#00A9AE] rounded-sm">
                {listPart.map((dt, index) => {
                  return (
                    <>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Select
                            placeholder="Chọn sản phẩm cần thêm"
                            showSearch
                            className="min-w-56"
                            onSelect={(e) => {
                              const data = dataProducts.find(
                                (dt) => dt.product_id === e
                              );
                              handlePush(index, data);
                            }}
                            filterOption={(input, option) => {
                              return (option?.children?.join("") ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase());
                            }}
                          >
                            {dataProducts?.map((dt) => {
                              // const maxQuantity = dt.code_product.filter(
                              //   (dt) => dt.status === "inventory"
                              // ).length;
                              return (
                                <Option
                                  // disabled={!(maxQuantity > 0)}
                                  key={dt.product_id}
                                  value={dt.product_id}
                                >
                                  {dt.name}
                                </Option>
                              );
                            })}
                          </Select>
                          <div className="flex gap-2">
                            {listPart.length > 1 && (
                              <Input
                                defaultValue={dt.title}
                                onChange={(e) => {
                                  handleChangeTitle(index, e.target.value);
                                }}
                                placeholder="Nhập tên tiêu đề"
                              />
                            )}
                            <Select
                              placeholder="Chọn gói"
                              showSearch
                              allowClear
                              className="min-w-56"
                              defaultValue={dt.type_package}
                              onSelect={(e) => {
                                handleChangeTypePackage(index, e);
                              }}
                              onClear={() => {
                                handleChangeTypePackage(index, undefined);
                              }}
                              filterOption={(input, option) => {
                                return (option?.children?.join("") ?? "")
                                  .toLowerCase()
                                  .includes(input.toLowerCase());
                              }}
                            >
                              {dataTypePackages?.map((dt) => {
                                return (
                                  <Option
                                    key={dt.package_id}
                                    value={dt.package_id}
                                  >
                                    {dt.name_package}
                                  </Option>
                                );
                              })}
                            </Select>
                          </div>
                        </div>
                        <div className=" w-full overflow-x-auto">
                          <div className="min-w-fit custom-table-wrapper">
                            <Table<IGetProductInfo>
                              columns={customColumns(index)}
                              showHeader={index === 0}
                              footer={() => {
                                const total = listPart[index].products.reduce(
                                  (preValue, currValue) => {
                                    const priceProfit =
                                      currValue.price *
                                      currValue.quantity *
                                      ((dataProfits.find(
                                        (dt) =>
                                          dt.profit_id === currValue.profit
                                      )?.type_profit ?? 0) /
                                        100);
                                    return (
                                      currValue.price * currValue.quantity +
                                      priceProfit +
                                      preValue
                                    );
                                  },
                                  0
                                );

                                return (
                                  <div className="flex gap-2">
                                    <strong>Giá trị:</strong>{" "}
                                    {/* {dataSource.length} */}
                                    {total.toLocaleString("vi-VN")} VNĐ
                                  </div>
                                );
                              }}
                              // rowSelection={rowSelection}
                              dataSource={dt.products}
                              pagination={{
                                pageSize: 10,
                                showTotal: (total, range) =>
                                  `${range[0]}-${range[1]} of ${total} items`,
                              }}
                              scroll={{ x: "max-content", y: 200 }}
                              showSorterTooltip={{ target: "sorter-icon" }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            )}
          </TabPane>
        </Tabs>
        <div className="flex flex-col items-end gap-2 p-2 w-full bg-slate-100 rounded-sm">
          <div className="flex items-center">
            <p className="w-80 flex justify-end">Tổng:</p>
            <span className="min-w-32 flex justify-end">
              {priceTotal.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <div>
            <div className="flex items-center justify-end">
              <div className="w-80 flex items-center justify-end gap-2">
                Chiết khấu{" "}
                <div className="w-60">
                  <InputNumber
                    addonAfter={selectAfter}
                    defaultValue={0}
                    onChange={(e) => {
                      setDiscount(e ?? 0);
                    }}
                  />
                </div>
              </div>

              <span className="min-w-32 flex justify-end">
                -{priceDiscount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <p className="w-80 flex justify-end">Thuế:</p>
            <span className="min-w-32 flex justify-end">{priceVat}đ</span>
          </div>
          <div className="flex items-center text-xl text-red-500">
            <p className="w-80 flex justify-end">Thành tiền:</p>
            <span className="min-w-32 flex justify-end">
              {(priceTotal - priceDiscount + priceVat).toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Cập nhật
          </Button>
        </div>
      </Modal>
      <ModalAddProject
        refBtnProject={refBtnProject as Ref<HTMLButtonElement>}
      />
    </>
  );
}
