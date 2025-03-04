"use client";
import React, { Ref, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  DatePicker,
  Divider,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { IoAddOutline } from "react-icons/io5";
import usePostData from "@/hooks/usePostData";
import { ICreateOpportunitiesDto } from "@/models/opportunityInterface";
import opportunityService from "@/services/opportunityService.";
import ModalTypeOpportunity from "./ModalTypeOpportunity/ModalTypeOpportunity";
import ModalSourceOpportunity from "./ModalSourceOpportunity/ModalSourceOpportunity";
import { fetchOpportunities } from "@/redux/store/slices/opportunitySlices/get_opportunities.slice";

const ModalAddOpportunity = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const refBtnSource = useRef<HTMLButtonElement>();
  const refBtnType = useRef<HTMLButtonElement>();
  const dispatch = useDispatch<AppDispatch>();
  useDispatch<AppDispatch>();
  const { datas: dataTypes } = useSelector(
    (state: RootState) => state.type_opportunity
  );
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.source_opportunity
  );
  const { datas: dataProvinces } = useSelector(
    (state: RootState) => state.province_system
  );
  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );
  const { postdata } = usePostData();

  const [form] = useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: ICreateOpportunitiesDto) => {
    try {
      console.log(values);
      const statusCode = await postdata(() =>
        opportunityService.createOpportunity(values)
      );
      if (statusCode === 201) {
        dispatch(fetchOpportunities({}));
        form.resetFields();
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error creating opportunity:", error);
    }
  };

  return (
    <>
      <Button
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
      >
        Tạo cơ hội
      </Button>
      <Modal
        title="Điền form cơ hội"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}
        >
          <Form.Item
            name="name_contact"
            label="Tên người liên hệ"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Tên" />
          </Form.Item>
          <Form.Item
            name="company_name"
            label="Tên công ty"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Input placeholder="Tên công ty" />
          </Form.Item>
          <Form.Item
            name="type_opportunity"
            label="Loại cơ hội"
            rules={[
              { required: true, message: "Please select an opportunity type!" },
            ]}
            style={{ minWidth: "220px", flex: "1 1 0%" }}
          >
            <Select
              placeholder="Select type"
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
              {dataTypes?.map((item) => (
                <Select.Option
                  key={item.type_opportunity_id}
                  value={item.type_opportunity_id}
                >
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type_source"
            label="Nguồn cơ hội"
            rules={[
              { required: true, message: "Please select a source type!" },
            ]}
            style={{ minWidth: "220px", flex: "1 1 0%" }}
          >
            <Select
              placeholder="Select source"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Button
                    type="link"
                    onClick={() => {
                      refBtnSource.current?.click();
                    }}
                  >
                    + Thêm tùy chọn mới
                  </Button>
                </>
              )}
            >
              {dataSources?.map((item) => (
                <Select.Option
                  key={item.type_source_id}
                  value={item.type_source_id}
                >
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="user_support"
            label="Nhân viên hỗ trợ"
            style={{ minWidth: "220px", flex: "1 1 0%" }}
          >
            <Select placeholder="Select staff">
              {dataUsers?.map((item) => (
                <Select.Option key={item.user_id} value={item.user_id}>
                  {item.first_name} {item.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Số điện thoại"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Input placeholder="Địa chỉ" />
          </Form.Item>
          <Form.Item
            name="province"
            label="Khu vực"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Select placeholder="Select province">
              {dataProvinces?.map((item) => (
                <Select.Option key={item.province_id} value={item.province_id}>
                  {item.name_province}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Input placeholder="Website" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Chức vụ"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Input placeholder="Position" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá trị (vnđ)"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <InputNumber
              placeholder="Price"
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
            />
          </Form.Item>
          <Form.Item
            name="latch_date"
            label="Hạn chốt"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <DatePicker placeholder="Select date" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" style={{ width: "100%" }}>
            <Input.TextArea
              placeholder="Description"
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>

          <Form.Item
            style={{ width: "100%", display: "flex", justifyContent: "end" }}
          >
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ModalTypeOpportunity refBtnType={refBtnType as Ref<HTMLButtonElement>} />
      <ModalSourceOpportunity
        refBtnSource={refBtnSource as Ref<HTMLButtonElement>}
      />
    </>
  );
};

export default ModalAddOpportunity;
