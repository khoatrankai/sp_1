import usePostData from "@/hooks/usePostData";
import { Vat } from "@/models/systemInterface";
import { fetchSystemVats } from "@/redux/store/slices/systemSlices/get_vat.slice";
import { AppDispatch } from "@/redux/store/store";
import systemService from "@/services/systemService";
import { Button, Form, InputNumber, Modal, Tabs } from "antd";
import { useForm } from "antd/es/form/Form";
import TabPane from "antd/es/tabs/TabPane";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
  ID: string;
};

export default function ModalUpdateVat({ ID }: Props) {
  const [form] = useForm();
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
    fetchData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchData = async () => {
    const res = await systemService.getVat(ID);
    if (res.statusCode === 200) {
      form.setFieldsValue(res.data);
    }
  };

  const handleSubmit = async (values: Vat) => {
    const res = await postdata(() => systemService.updateVat(ID, values));
    if (res === 200 || res === 201) {
      dispatch(fetchSystemVats());
      setIsModalVisible(false);
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
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Cập nhật thuế"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin thuế" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >
              <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
              >
                <Form.Item
                  name="type_vat"
                  label="Số thuế"
                  style={{ minWidth: "100%", flex: "1 1 0%" }}
                >
                  <InputNumber />
                </Form.Item>
              </Form>
            </Form>
          </TabPane>
        </Tabs>

        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Cập nhật
          </Button>
        </div>
      </Modal>
    </>
  );
}
