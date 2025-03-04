import usePostData from "@/hooks/usePostData";
import { TargetRevenue } from "@/models/systemInterface";
import { fetchTargetRevenue } from "@/redux/store/slices/systemSlices/get_target.slice";
import { AppDispatch } from "@/redux/store/store";
import systemService from "@/services/systemService";
import { Button, DatePicker, Form, InputNumber, Modal, Tabs } from "antd";
import { useForm } from "antd/es/form/Form";
import TabPane from "antd/es/tabs/TabPane";
import React, { Ref, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";

type Props = {
  refBtnTargetRevenue?: Ref<HTMLButtonElement>;
};

export default function ModalAddTargetRevenue({ refBtnTargetRevenue }: Props) {
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

  const handleSubmit = async (values: TargetRevenue) => {
    const res = await postdata(() =>
      systemService.createTarget({
        ...values,
        year: new Date(values.year ?? "").getFullYear(),
      })
    );
    if (res === 200 || res === 201) {
      dispatch(fetchTargetRevenue());
      setIsModalVisible(false);
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };

  return (
    <>
      <Button
        hidden={refBtnTargetRevenue ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnTargetRevenue}
      >
        Thêm mục tiêu
      </Button>
      <Modal
        title="Tạo mục tiêu"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin mục tiêu" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >
              <Form.Item
                name="revenue"
                label="Doanh thu mong muốn"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <InputNumber
                  placeholder="Giá"
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
                name="year"
                label="Năm"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <DatePicker placeholder="Chọn năm" picker="year" />
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
