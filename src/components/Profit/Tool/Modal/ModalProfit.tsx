import usePostData from "@/hooks/usePostData";
import { Profit } from "@/models/systemInterface";
import { fetchSystemProfits } from "@/redux/store/slices/systemSlices/get_profit.slice";
import { AppDispatch } from "@/redux/store/store";
import systemService from "@/services/systemService";
import { Button, Form, InputNumber, Modal, Tabs } from "antd";
import { useForm } from "antd/es/form/Form";
import TabPane from "antd/es/tabs/TabPane";
import React, { Ref, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";

type Props = {
  refBtnProfit?: Ref<HTMLButtonElement>;
};

export default function ModalAddProfit({ refBtnProfit }: Props) {
  const [form] = useForm();
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: Profit) => {
    const res = await postdata(() => systemService.createProfit(values));
    if (res === 200 || res === 201) {
      dispatch(fetchSystemProfits());
      setIsModalVisible(false);
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };

  return (
    <>
      <Button
        hidden={refBtnProfit ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnProfit}
      >
        Thêm lợi nhuận
      </Button>
      <Modal
        title="Tạo lợi nhuận"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin lợi nhuận" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >
              <Form.Item
                name="type_profit"
                label="Số lợi nhuận"
                style={{ minWidth: "100%", flex: "1 1 0%" }}
              >
                <InputNumber />
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Tạo
          </Button>
        </div>
      </Modal>
    </>
  );
}
