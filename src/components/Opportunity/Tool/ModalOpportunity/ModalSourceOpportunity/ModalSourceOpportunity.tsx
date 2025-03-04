"use client";
import React, { Ref, useState } from "react";
import { Button, Form, Input, Modal, Table } from "antd";
import usePostData from "@/hooks/usePostData";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import { IoIosAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import "./style.scss";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import {
  ICreateOpportunitySourcesDto,
  IGetSourcesOpportunityDto,
} from "@/models/opportunityInterface";
import opportunityService from "@/services/opportunityService.";
import { fetchSourcesOpportunity } from "@/redux/store/slices/opportunitySlices/get_source.slice";
import { fetchOpportunities } from "@/redux/store/slices/opportunitySlices/get_opportunities.slice";

type Props = {
  refBtnSource?: Ref<HTMLButtonElement>;
};

const ModalSourceOpportunity = ({ refBtnSource }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [indexEdit, setIndexEdit] = useState<number[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.source_opportunity
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
  const columns: ColumnsType<IGetSourcesOpportunityDto> = [
    {
      title: "Mã nguồn",
      dataIndex: "type_source_id",
      key: "type_source_id",
      render: (value, record, index) => (
        <div className="flex gap-1 items-center">
          #{index + 1}.{value}
        </div>
      ),
    },
    {
      title: "Tên nguồn",
      dataIndex: "name",
      key: "name",
      width: "50%",
      render: (value, record, index) => {
        return (
          <>
            {indexEdit.includes(index) ? (
              <Form
                onFinish={(e) => {
                  handleSubmitEdit(e.name, record.type_source_id, index);
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
                  <Input placeholder="Nhập tên nguồn" defaultValue={value} />
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

  const handleSubmit = async (values: ICreateOpportunitySourcesDto) => {
    try {
      const statusCode = await postdata(() =>
        opportunityService.createSourceOpportunity(values)
      );

      if (statusCode === 201) {
        dispatch(fetchSourcesOpportunity());
        formType.resetFields();
      }
    } catch (error) {
      console.error("Error creating unit product:", error);
    }
  };

  const handleSubmitEdit = async (value: string, id: string, index: number) => {
    try {
      const statusCode = await postdata(() =>
        opportunityService.updateSourceOpportunity(id, value)
      );

      if (statusCode === 200) {
        dispatch(fetchOpportunities({}));
        dispatch(fetchSourcesOpportunity());
        handlePopIndex(index);
      }
    } catch (error) {
      console.error("Error creating unit product:", error);
    }
  };

  return (
    <>
      <Button
        className="bg-blue-400 border-0 text-white font-semibold"
        onClick={showModal}
        hidden={refBtnSource ? true : false}
        ref={refBtnSource}
      >
        Nguồn cơ hội
      </Button>
      <Modal
        title={
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span>Nguồn cơ hội</span>
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
              <Table<IGetSourcesOpportunityDto>
                columns={columns}
                // rowSelection={rowSelection}
                scroll={{ x: "max-content" }}
                className="custom-table"
                dataSource={dataSource}
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

export default ModalSourceOpportunity;
