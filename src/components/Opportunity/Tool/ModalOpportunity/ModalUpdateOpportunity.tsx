"use client";
import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import { Moment } from "moment";
import usePostData from "@/hooks/usePostData";
import { useForm } from "antd/es/form/Form";
// import ModalQrScanner from "./ModalQrScanner";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import opportunityService from "@/services/opportunityService.";
import { useSelector } from "react-redux";
import { IUpdateOpportunitiesDto } from "@/models/opportunityInterface";
import { fetchOpportunities } from "@/redux/store/slices/opportunitySlices/get_opportunities.slice";
import dayjs from "dayjs";

type Props = {
  ID: string;
};

const ModalUpdateOpportunity = (props: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { datas: dataTypes } = useSelector(
    (state: RootState) => state.type_opportunity
  );
  const [tabTransform, setTabTransform] = useState<boolean>(false);
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
  const dispatch = useDispatch<AppDispatch>();

  const [form] = useForm();

  const fetchData = async () => {
    const res = await opportunityService.getOpportunity(props.ID);
    if (res.statusCode === 200) {
      form.setFieldsValue({
        ...res.data,
        type_opportunity: res.data.type_opportunity.type_opportunity_id,
        type_source: res.data.type_source.type_source_id,
      });
      if (res.data.status !== "success") {
        setTabTransform(true);
      }
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
    fetchData();
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: IUpdateOpportunitiesDto) => {
    try {
      const statusCode = await postdata(() =>
        opportunityService.updateOpportunity(props.ID, values)
      );
      if (statusCode === 200) {
        dispatch(fetchOpportunities({}));
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <>
      <Button
        className="w-fit text-xs text-yellow-500 font-semibold"
        type="link"
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Thông tin cơ hội"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Button
          hidden={!tabTransform}
          type="primary"
          onClick={() => {
            handleSubmit({ status: "success" });
          }}
        >
          Chuyển đổi khách hàng
        </Button>

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
            <Select placeholder="Select type">
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
            <Select placeholder="Select source">
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
            initialValue=""
            className=" mb-0"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
            getValueFromEvent={(e: Moment) => e?.format("YYYY-MM-DD")}
            getValueProps={(e: string) => ({
              value: e ? dayjs(e) : "",
            })}
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
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalUpdateOpportunity;
