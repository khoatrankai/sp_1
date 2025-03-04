import usePostData from "@/hooks/usePostData";
import { TargetRevenue } from "@/models/systemInterface";
import { fetchTargetRevenue } from "@/redux/store/slices/systemSlices/get_target.slice";
import { AppDispatch } from "@/redux/store/store";
import systemService from "@/services/systemService";
import { Button, DatePicker, Form, InputNumber, Modal, Tabs } from "antd";
import { useForm } from "antd/es/form/Form";
import TabPane from "antd/es/tabs/TabPane";
import dayjs from "dayjs";
import { Moment } from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
  ID: string;
};

export default function ModalUpdateTargetRevenue({ ID }: Props) {
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
    const res = await systemService.getTarget(ID);
    if (res.statusCode === 200) {
      form.setFieldsValue({ ...res.data, year: new Date(res.data.year, 0, 1) });
    }
  };

  const handleSubmit = async (values: TargetRevenue) => {
    const res = await postdata(() =>
      systemService.updateTarget(ID, {
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
        className="  text-xs text-yellow-500 font-semibold"
        type="text"
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Cập nhật mục tiêu"
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
                initialValue=""
                className=" mb-0"
                getValueFromEvent={(e: Moment) => e?.format("YYYY-MM-DD")}
                getValueProps={(e: string) => ({
                  value: e ? dayjs(e) : "",
                })}
              >
                <DatePicker placeholder="Chọn năm" picker="year" />
              </Form.Item>
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
