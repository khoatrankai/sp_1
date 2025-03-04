/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from "@/hooks/usePostData";
import { fetchCustomerProfile } from "@/redux/store/slices/customerSlices/get_profile.slice";
import { AppDispatch } from "@/redux/store/store";
import customerService from "@/services/roleCustomerService/customerService";
import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { Ref, useRef, useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
  refBtnUser?: Ref<HTMLButtonElement>;
};

export default function ModalChangePassword({ refBtnUser }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const refBtn = useRef<HTMLButtonElement>();
  const [form] = useForm();

  const { postdata } = usePostData();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = async () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: {
    old_password: string;
    new_password: string;
    again_password: string;
  }) => {
    const res = await postdata(() =>
      customerService.updatePasswordCustomer(values)
    );
    refBtn.current?.click();
    if (res === 200 || res === 201) {
      setIsModalVisible(false);
      dispatch(fetchCustomerProfile());
      form.resetFields();
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };

  return (
    <>
      <Button
        className="  text-xs text-yellow-500 font-semibold"
        type="text"
        hidden={refBtnUser ? true : false}
        ref={refBtnUser}
        onClick={showModal}
      ></Button>
      <Modal
        title={"Cập nhật password"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "400px" }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
        >
          <Form.Item
            name="old_password"
            label="Mật khẩu cũ"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Input.Password placeholder="Nhập mật khẩu cũ" />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            name="again_password"
            label="Xác nhận mật khẩu mới"
            dependencies={["new_password"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
        </Form>

        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Cập nhật
          </Button>
        </div>
      </Modal>
    </>
  );
}
