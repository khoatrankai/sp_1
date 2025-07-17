/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateWarranty } from "@/models/productInterface";
import { fetchWarranties } from "@/redux/store/slices/productSlices/get_all_warranty.slice";
import { AppDispatch } from "@/redux/store/store";
import productService from "@/services/productService";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import dayjs from "dayjs";
import { Moment } from "moment";
import React, { Ref, useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
  warranty_id?: string;
  refBtnCustomer?: Ref<HTMLButtonElement>;
  type?: "customer" | "admin";
  idAsset?:string
};

export default function ModalUpdateWarranty({
  warranty_id,
  refBtnCustomer,
  idAsset
}: Props) {
  const [form] = useForm();
  const dispatch = useDispatch<AppDispatch>();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const fetchData = async () => {
    const res = await productService.getWarrantyID(
      warranty_id as string
    );
    if (res.statusCode === 200 && res.data) {
      form.setFieldsValue({
        ...res.data,
      });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    fetchData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: CreateWarranty) => {
    
    const res = await productService.updateWarranty(warranty_id as string, values)

      if (res === 200 || res === 201) {
        form.resetFields();
        setIsModalVisible(false);
        dispatch(
          fetchWarranties(idAsset ?? "")
        );
      }

    // console.log(values);
  };


  return (
    <>
      <Button
        className="  text-xs text-yellow-500 font-semibold"
        type="text"
        hidden={refBtnCustomer ? true : false}
        ref={refBtnCustomer}
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Cập nhật bảo hành"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          form={form}
          style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
        >
          <div className="flex flex-wrap gap-2 h-fit w-fit rounded-lg p-1">
            <Form.Item
              name="date_start"
              label="Ngày bắt đầu bảo hành"
              rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
              getValueFromEvent={(e: Moment) => e?.format("YYYY-MM-DD")}
              getValueProps={(e: string) => ({
                value: e ? dayjs(e) : "",
              })}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
        
            <Form.Item
              name="reason"
              label="Lý do bảo hành"
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
        
            <Form.Item
              name="review"
              label="Đánh giá tình trạng"
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
        
            <Form.Item
              name="solve"
              label="Giải pháp xử lý"
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
        
            <Form.Item
              name="date_end"
              label="Ngày kết thúc bảo hành"
              style={{ minWidth: "320px", flex: "1 1 0%" }}
              getValueFromEvent={(e: Moment) => e?.format("YYYY-MM-DD")}
              getValueProps={(e: string) => ({
                value: e ? dayjs(e) : "",
              })}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
        
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="pending">Chờ xử lý</Option>
                <Option value="in_progress">Đang xử lý</Option>
                <Option value="completed">Đã hoàn thành</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Form.Item>
        
            <Form.Item
              name="note"
              label="Ghi chú"
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </div>
        
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
}
