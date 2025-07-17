/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateWarranty } from "@/models/productInterface";
import { fetchWarranties } from "@/redux/store/slices/productSlices/get_all_warranty.slice";
import { AppDispatch } from "@/redux/store/store";
import productService from "@/services/productService";
import {
  Button,
  Form,
  Input,
  Modal,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { Ref, useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
  warranty_id?: string;
  refBtnCustomer?: Ref<HTMLButtonElement>;
  type?: "customer" | "admin";
  idAsset?:string
};

export default function ModalReviewWarranty({
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
    
    const res = await productService.updateWarranty(warranty_id as string, {...values,status:"completed"})

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
        Đánh giá
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
              name="review"
              label="Đánh giá tình trạng"
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input.TextArea rows={3} />
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
