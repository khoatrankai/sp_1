"use client";
import React, { Ref, useState } from "react";
import { Button, Form, Input, Modal, Table } from "antd";
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
import priceQuoteService from "@/services/priceQuoteService";
import { fetchTypePackage } from "@/redux/store/slices/priceQuoteSlices/get_type_package.slice";
import { ITypePackage } from "@/models/priceQuoteInterface";
type Props = {
  refBtnTypePackage?: Ref<HTMLButtonElement>;
};
const ModalTypePackage = ({ refBtnTypePackage }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [indexEdit, setIndexEdit] = useState<number[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataTypePackages } = useSelector(
    (state: RootState) => state.type_package
  );
  const handleSubmitEdit = async (value: string, id: string, index: number) => {
    try {
      const statusCode = await postdata(() =>
        priceQuoteService.updateTypePackage(id, value)
      );

      if (statusCode === 200) {
        dispatch(fetchTypePackage());
        handlePopIndex(index);
      }
    } catch (error) {
      console.error("Error creating unit :", error);
    }
  };
  const handlePushIndex = (index: number) => {
    setIndexEdit([...indexEdit, index]);
  };

  const handlePopIndex = (index: number) => {
    setIndexEdit(indexEdit.filter((dt) => dt !== index));
  };
  // const [dataSource, setDataSource] = useState<IType[] | []>([]);
  const [tabFormType, setTabFormType] = useState<boolean>(false);
  const { postdata } = usePostData();
  const [formType] = useForm();

  // useEffect(() => {
  //   console.log(dataSource);
  // }, [dataSource]);
  const columns: ColumnsType<ITypePackage> = [
    {
      title: "Mã gói",
      dataIndex: "package_id",
      key: "package_id",
      render: (value, record, index) => (
        <div className="flex gap-1 items-center">
          #{index + 1}.{value}
        </div>
      ),
    },
    {
      title: "Loại gói",
      dataIndex: "name_package",
      width: "50%",
      key: "name_package",
      render: (value, record, index) => {
        return (
          <>
            {indexEdit.includes(index) ? (
              <Form
                onFinish={(e) => {
                  handleSubmitEdit(e.name, record.package_id, index);
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
                      message: "Vui lòng nhập tên gói",
                    },
                  ]}
                  style={{ margin: "0" }}
                >
                  <Input placeholder="Nhập tên gói" defaultValue={value} />
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

  const handleSubmit = async (values: ITypePackage) => {
    try {
      const statusCode = await postdata(() =>
        priceQuoteService.createTypePackage(values)
      );

      if (statusCode === 201) {
        dispatch(fetchTypePackage());
        formType.resetFields();
      }
    } catch (error) {
      console.error("Error creating :", error);
    }
  };

  return (
    <>
      <Button
        hidden={refBtnTypePackage ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        onClick={showModal}
        ref={refBtnTypePackage}
      >
        Gói báo giá
      </Button>
      <Modal
        title="Gói báo giá"
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
                name="name_package"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên xuất xứ",
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
              <Table<ITypePackage>
                columns={columns}
                scroll={{ x: "max-content" }}
                className="custom-table"
                // rowSelection={rowSelection}
                dataSource={dataTypePackages}
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

export default ModalTypePackage;
