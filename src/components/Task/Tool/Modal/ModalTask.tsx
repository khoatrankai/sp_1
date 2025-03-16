/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
import usePostData from "@/hooks/usePostData";
import { ICreateTask } from "@/models/activityInterface";
import activityService from "@/services/activityService";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Tabs,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import TabPane from "antd/es/tabs/TabPane";
// import moment from "moment";
import React, { Ref, useState } from "react";
import { IoAddOutline } from "react-icons/io5";

type Props = {
  id:string
  refBtnTask?: Ref<HTMLButtonElement>;
  resetData?:any
};

export default function ModalAddTask({refBtnTask,id,resetData
}: Props) {


  const [form] = useForm();
  const { postdata } = usePostData();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: ICreateTask) => {
    const res = await postdata(() =>
      activityService.createTask({ ...values,work:id })
    );
    if (res === 200 || res === 201) {
      resetData()
      setIsModalVisible(false);
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };



  return (
    <>
      <Button
        hidden={refBtnTask ? true : false}
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnTask}
      >
        Thêm task
      </Button>
      <Modal
        title="Tạo task"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin task" key={1}>
            
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >
              
              <Form.Item
                name="name"
                label="Tên task"
                rules={[
                  {
                    required: true,
                    type: "string",
                    message: "Vui lòng nhập tên công việc",
                  },
                ]}
                style={{ minWidth: "100%", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="status"
                label="Trạng thái"
                // rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn trạng thái"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                 
                >
                  <Option key={'1'} value={'waitting'}>
                        Đang thực hiện
                      </Option>
                      <Option key={'2'} value={'success'}>
                        Thành công
                      </Option>
                      <Option key={'3'} value={'fail'}>
                        Thất bại
                      </Option>
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
              <Form.Item
                name="time_start"
                className=" mb-0"
                // rules={[{ required: true }]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
                // getValueProps={(value) => ({
                //   value: value ? moment(value) : null,
                // })}
              >
                <DatePicker
                  placeholder="Chọn ngày bắt đầu"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                className=" mb-0"
                name="time_end"
                rules={[{ required: true }]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
                // getValueProps={(value) => ({
                //   value: value ? moment(value) : null,
                // })}
              >
                <DatePicker
                  placeholder="Chọn ngày kết thúc"
                  style={{ width: "100%" }}
                />
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
