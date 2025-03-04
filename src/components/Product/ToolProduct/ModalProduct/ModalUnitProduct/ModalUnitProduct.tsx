"use client";
import React, { Ref, useState } from "react";
import { Button, Form, Input, Modal, Table } from "antd";
import productService from "@/services/productService";
import usePostData from "@/hooks/usePostData";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import { IoIosAdd } from "react-icons/io";
import { IUnitProduct } from "@/models/productInterface";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import "./style.scss";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { fetchProductUnits } from "@/redux/store/slices/productSlices/get_unit.slice";
import { fetchProductInfos } from "@/redux/store/slices/productSlices/get_products";
import { fetchProductAbout } from "@/redux/store/slices/productSlices/get_about.slice";
type Props = {
  refBtnUnit?: Ref<HTMLButtonElement>;
};
const ModalUnitProduct = ({ refBtnUnit }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [indexEdit, setIndexEdit] = useState<number[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataUnits } = useSelector(
    (state: RootState) => state.unit_product
  );
  const [tabFormType, setTabFormType] = useState<boolean>(false);
  const { postdata } = usePostData();
  const handlePushIndex = (index: number) => {
    setIndexEdit([...indexEdit, index]);
  };

  const handlePopIndex = (index: number) => {
    setIndexEdit(indexEdit.filter((dt) => dt !== index));
  };

  const [formType] = useForm();
  const columns: ColumnsType<IUnitProduct> = [
    {
      title: "Mã đơn vị",
      dataIndex: "unit_id",
      key: "type_product_id",
      render: (value, record, index) => (
        <div className="flex gap-1 items-center">
          #{index + 1}.{value}
        </div>
      ),
    },
    {
      title: "Tên đơn vị",
      dataIndex: "name_unit",
      key: "name_unit",
      width: "50%",
      render: (value, record, index) => {
        return (
          <>
            {indexEdit.includes(index) ? (
              <Form
                onFinish={(e) => {
                  handleSubmitEdit(e.name, record.unit_id, index);
                }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <Form.Item
                  name="name_unit"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên mới",
                    },
                  ]}
                  style={{ margin: "0" }}
                >
                  <Input placeholder="Nhập tên đơn vị" defaultValue={value} />
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

  const handleSubmit = async (values: IUnitProduct) => {
    try {
      const statusCode = await postdata(() =>
        productService.createUnit(values)
      );

      if (statusCode === 201) {
        dispatch(fetchProductUnits());
        formType.resetFields();
      }
    } catch (error) {
      console.error("Error creating unit product:", error);
    }
  };

  const handleSubmitEdit = async (value: string, id: string, index: number) => {
    try {
      const statusCode = await postdata(() =>
        productService.updateUnit(id, value)
      );

      if (statusCode === 200) {
        dispatch(fetchProductInfos());
        dispatch(fetchProductAbout());
        dispatch(fetchProductUnits());
        handlePopIndex(index);
      }
    } catch (error) {
      console.error("Error creating unit product:", error);
    }
  };

  return (
    <>
      <Button
        hidden={refBtnUnit ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        onClick={showModal}
        ref={refBtnUnit}
      >
        Đơn vị sản phẩm
      </Button>
      <Modal
        title="Đơn vị sản phẩm"
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
                name="name_unit"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên đơn vị",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên đơn vị" />
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
              <Table<IUnitProduct>
                columns={columns}
                // rowSelection={rowSelection}
                scroll={{ x: "max-content" }}
                className="custom-table"
                dataSource={dataUnits}
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

export default ModalUnitProduct;
