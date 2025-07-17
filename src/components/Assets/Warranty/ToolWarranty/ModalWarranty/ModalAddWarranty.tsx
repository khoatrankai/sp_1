/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppDispatch } from "@/redux/store/store";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  // Select,
} from "antd";
// import { Option } from "antd/es/mentions";
// import SubMenu from "antd/es/menu/SubMenu";
import React, { Ref, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IoAddOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useForm } from "antd/es/form/Form";
import { Moment } from "moment";
import dayjs from "dayjs";
import { CreateWarranty } from "@/models/productInterface";
import productService from "@/services/productService";
import { fetchWarranties } from "@/redux/store/slices/productSlices/get_all_warranty.slice";

type Props = {
  refBtnWarranty?: Ref<HTMLButtonElement>;
  idAsset?:string
};

export default function ModalAddWarranty({ refBtnWarranty,idAsset }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [form] = useForm();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: CreateWarranty) => {
    
    const res = await productService.createWarranty({...values, asset:idAsset ?? ""});
    if (res === 200 || res === 201) {
      form.resetFields();
      setIsModalVisible(false);
      // dispatch(fetchCustomerInfos());
      dispatch(fetchWarranties(idAsset??""));
    }
  };



  return (
    <>
      <Button
        hidden={refBtnWarranty ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnWarranty}
      >
        Thêm lịch bảo hành
      </Button>
      <Modal
        title="Tạo lịch"
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

    {/* <Form.Item
      name="review"
      label="Đánh giá tình trạng"
      style={{ minWidth: "320px", flex: "1 1 0%" }}
    >
      <Input.TextArea rows={3} />
    </Form.Item> */}

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

    {/* <Form.Item
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
    </Form.Item> */}

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
      Tạo
    </Button>
  </Form.Item>
</Form>

      </Modal>
    </>
  );
}
