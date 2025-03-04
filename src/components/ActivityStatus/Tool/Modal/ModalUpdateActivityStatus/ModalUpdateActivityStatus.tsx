import usePostData from "@/hooks/usePostData";
import { IUpdateActivityContainer } from "@/models/productInterface";
import { fetchActivityContainers } from "@/redux/store/slices/productSlices/get_activity_container.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import productService from "@/services/productService";
import { Button, Form, Input, Modal, Select, Tabs } from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import TabPane from "antd/es/tabs/TabPane";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

type Props = {
  ID: string;
};

export default function ModalUpdateActivityStatus({ ID }: Props) {
  const [form] = useForm();
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataActivities } = useSelector(
    (state: RootState) => state.get_activities
  );
  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );

  const { datas: dataCustomers } = useSelector(
    (state: RootState) => state.infos_customer
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
    fetchData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchData = async () => {
    const res = await productService.findActivityContainerById(ID);
    if (res.statusCode === 200) {
      form.setFieldsValue(res.data);
    }
  };

  const handleSubmit = async (values: IUpdateActivityContainer) => {
    const res = await postdata(() =>
      productService.updateActivityContainer(ID, values)
    );
    if (res === 200 || res === 201) {
      dispatch(fetchActivityContainers("status"));
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
        title="Cập nhật thông tin"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin xuất" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: "12px",
                rowGap: "6px",
              }}
            >
              <Form.Item
                name="activity"
                className="!m-0"
                label="Hoạt động"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn hoạt động"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {dataActivities?.map((dt) => (
                    <Option key={dt.activity_id} value={dt.activity_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="customer"
                className="!m-0"
                label="Khách hàng"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn khách hàng"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {dataCustomers?.map((dt) => (
                    <Option key={dt.info_id} value={dt.info_id}>
                      {dt.name_company}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="user"
                className="!m-0"
                label="Nhân viên"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn nhân viên"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {dataUsers?.map((dt) => (
                    <Option key={dt.user_id} value={dt.user_id}>
                      {dt.first_name + " " + dt.last_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả"
                style={{ width: "100%" }}
              >
                <Input.TextArea
                  placeholder="Description"
                  autoSize={{ minRows: 3 }}
                />
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
