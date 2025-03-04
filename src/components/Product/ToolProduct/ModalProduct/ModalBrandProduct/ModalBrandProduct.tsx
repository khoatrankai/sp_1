"use client";
import React, { Ref, useState } from "react";
import { Button, Form, Input, Modal, Table } from "antd";
import productService from "@/services/productService";
import usePostData from "@/hooks/usePostData";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import { IoIosAdd } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchProductInfos } from "@/redux/store/slices/productSlices/get_products";
import { fetchProductAbout } from "@/redux/store/slices/productSlices/get_about.slice";
import { fetchProductBrands } from "@/redux/store/slices/productSlices/get_brand.slice";
import { IBrand } from "@/models/productInterface";
type Props = {
  refBtnBrand?: Ref<HTMLButtonElement>;
};
const ModalBrandProduct = ({ refBtnBrand }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [indexEdit, setIndexEdit] = useState<number[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataBrands } = useSelector(
    (state: RootState) => state.brand_product
  );
  const handleSubmitEdit = async (value: string, id: string, index: number) => {
    try {
      const statusCode = await postdata(() =>
        productService.updateBrand(id, value)
      );

      if (statusCode === 200) {
        dispatch(fetchProductInfos());
        dispatch(fetchProductBrands());
        dispatch(fetchProductAbout());
        handlePopIndex(index);
      }
    } catch (error) {
      console.error("Error creating unit product:", error);
    }
  };
  const handlePushIndex = (index: number) => {
    setIndexEdit([...indexEdit, index]);
  };

  const handlePopIndex = (index: number) => {
    setIndexEdit(indexEdit.filter((dt) => dt !== index));
  };
  // const [dataSource, setDataSource] = useState<ITypeProduct[] | []>([]);
  const [tabFormType, setTabFormType] = useState<boolean>(false);
  const { postdata } = usePostData();
  const [formType] = useForm();

  // useEffect(() => {
  //   console.log(dataSource);
  // }, [dataSource]);
  const columns: ColumnsType<IBrand> = [
    {
      title: "Mã thương hiệu",
      dataIndex: "brand_id",
      key: "brand_id",
      render: (value, record, index) => (
        <div className="flex gap-1 items-center">
          #{index + 1}.{value}
        </div>
      ),
    },
    {
      title: "Tên loại",
      dataIndex: "name",
      width: "50%",
      key: "name",
      render: (value, record, index) => {
        return (
          <>
            {indexEdit.includes(index) ? (
              <Form
                onFinish={(e) => {
                  handleSubmitEdit(e.name, record.brand_id, index);
                }}
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
                      message: "Vui lòng nhập tên mới",
                    },
                  ]}
                  style={{ margin: "0" }}
                >
                  <Input
                    placeholder="Nhập tên thương hiệu"
                    defaultValue={value}
                  />
                </Form.Item>
                <Form.Item
                  style={{
                    gap: "2px",
                    display: "flex",
                    justifyContent: "end",
                    margin: "0",
                  }}
                >
                  <Button
                    className="font-semibold border-transparent group"
                    type="link"
                    htmlType="submit"
                    icon={<FaCheck className="group-hover:text-green-500" />}
                  />
                  <Button
                    className="font-semibold border-transparent group"
                    type="link"
                    onClick={() => {
                      handlePopIndex(index);
                    }}
                    icon={<IoClose className="group-hover:text-red-500" />}
                  />
                </Form.Item>
              </Form>
            ) : (
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
            )}
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

  const handleSubmit = async (values: IBrand) => {
    try {
      const statusCode = await postdata(() =>
        productService.createBrand(values)
      );

      if (statusCode === 201) {
        dispatch(fetchProductBrands());
        formType.resetFields();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <>
      <Button
        hidden={refBtnBrand ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        onClick={showModal}
        ref={refBtnBrand}
      >
        Thương hiệu
      </Button>
      <Modal
        title="Thương hiệu"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <div className="flex flex-col gap-2">
          <Button
            className="bg-orange-500 text-white font-semibold"
            icon={<IoIosAdd />}
            onClick={() => {
              formType.resetFields();
              setTabFormType(!tabFormType);
            }}
          />
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
                    message: "Vui lòng nhập tên thương hiệu",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên loại" />
              </Form.Item>
              <Form.Item
                style={{
                  display: "flex",
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
          <div className="border-t-2 w-full overflow-x-auto">
            <div className="w-full">
              <Table<IBrand>
                columns={columns}
                scroll={{ x: "max-content" }}
                className="custom-table"
                // rowSelection={rowSelection}
                dataSource={dataBrands}
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

export default ModalBrandProduct;
