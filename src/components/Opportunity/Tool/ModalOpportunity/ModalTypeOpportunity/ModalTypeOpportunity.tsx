"use client";
import React, { Ref, useState } from "react";
import { Button, Form, Input, Modal, Table } from "antd";
// import productService from "@/services/productService";
import usePostData from "@/hooks/usePostData";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import { IoIosAdd } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// import { fetchProductTypes } from "@/redux/store/slices/productSlices/get_type.slice";
import {
  ICreateTypeOpportunitiesDto,
  IGetTypeOpportunitiesDto,
  IUpdateTypeOpportunitiesDto,
} from "@/models/opportunityInterface";
import opportunityService from "@/services/opportunityService.";
import { fetchOpportunityTypes } from "@/redux/store/slices/opportunitySlices/get_type.slice";
import { fetchOpportunities } from "@/redux/store/slices/opportunitySlices/get_opportunities.slice";

type Props = {
  refBtnType?: Ref<HTMLButtonElement>;
};

const ModalTypeOpportunity = ({ refBtnType }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [indexEdit, setIndexEdit] = useState<number>(-1);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataTypes } = useSelector(
    (state: RootState) => state.type_opportunity
  );

  const handlePushIndex = (index: number) => {
    console.log(index);
    setIndexEdit(index);
    formTypeEdit.setFieldsValue(dataTypes?.[index]);
  };

  // const [dataSource, setDataSource] = useState<ITypeProduct[] | []>([]);
  const [tabFormType, setTabFormType] = useState<boolean>(false);
  const { postdata } = usePostData();
  const [formType] = useForm();
  const [formTypeEdit] = useForm();

  // useEffect(() => {
  //   console.log(dataSource);
  // }, [dataSource]);
  const columns: ColumnsType<IGetTypeOpportunitiesDto> = [
    {
      title: "Mã loại",
      dataIndex: "type_opportunity_id",
      key: "type_opportunity_id",
      render: (value, record, index) => (
        <div className="flex gap-1 items-center">
          #{index + 1}.{value}
        </div>
      ),
    },
    {
      title: "Tên loại",
      dataIndex: "name",
      width: "40%",
      key: "name",
      render: (value) => {
        return (
          <>
            <strong className="flex gap-2 items-center">{value}</strong>
          </>
        );
      },
    },
    {
      title: "Tên tag",
      dataIndex: "name_tag",
      width: "35%",
      key: "name_tag",
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

  const handleSubmit = async (values: ICreateTypeOpportunitiesDto) => {
    try {
      const statusCode = await postdata(() =>
        opportunityService.createTypeOpportunity(values)
      );

      if (statusCode === 201) {
        dispatch(fetchOpportunityTypes());
        formType.resetFields();
        setTabFormType(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  const handleSubmitEdit = async (values: IUpdateTypeOpportunitiesDto) => {
    try {
      const statusCode = await postdata(() =>
        opportunityService.updateTypeOpportunity(
          dataTypes?.[indexEdit ?? 0].type_opportunity_id,
          values
        )
      );
      if (statusCode === 200) {
        dispatch(fetchOpportunityTypes());
        dispatch(fetchOpportunities({}));
        setIndexEdit(-1);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  return (
    <>
      <Button
        className="bg-blue-400 border-0 text-white font-semibold"
        onClick={showModal}
        hidden={refBtnType ? true : false}
        ref={refBtnType}
      >
        Loại cơ hội
      </Button>
      <Modal
        title={
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span>Loại cơ hội</span>
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
                    message: "Vui lòng nhập tên tag",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên tag" />
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
                    message: "Vui lòng nhập tên tag",
                  },
                ]}
                style={{ flex: "1 1 0%", margin: "0" }}
              >
                <Input placeholder="Nhập tên tag" />
              </Form.Item>
              <Form.Item
                style={{
                  display: "flex",
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
              <Table<IGetTypeOpportunitiesDto>
                columns={columns}
                scroll={{ x: "max-content" }}
                className="custom-table"
                // rowSelection={rowSelection}
                dataSource={dataTypes}
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

export default ModalTypeOpportunity;
