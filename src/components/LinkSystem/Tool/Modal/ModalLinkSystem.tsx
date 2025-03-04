import usePostData from "@/hooks/usePostData";
import { LinkSystem } from "@/models/systemInterface";
import { fetchLinkSystem } from "@/redux/store/slices/systemSlices/get_linksystem.slice";
import { AppDispatch } from "@/redux/store/store";
import systemService from "@/services/systemService";
import { Button, Form, Input, Modal, Tabs } from "antd";
import { useForm } from "antd/es/form/Form";
import TabPane from "antd/es/tabs/TabPane";
import React, { Ref, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";

type Props = {
  refBtnLinkSystem?: Ref<HTMLButtonElement>;
};

export default function ModalAddLinkSystem({ refBtnLinkSystem }: Props) {
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

  const handleSubmit = async (values: LinkSystem) => {
    const res = await postdata(() => systemService.createLinkSystem(values));
    if (res === 200 || res === 201) {
      dispatch(fetchLinkSystem());
      setIsModalVisible(false);
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };

  return (
    <>
      <Button
        hidden={refBtnLinkSystem ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnLinkSystem}
      >
        Thêm link
      </Button>
      <Modal
        title="Tạo link"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin link" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >
              <Form.Item
                name="link"
                label="Link"
                style={{ minWidth: "100%", flex: "1 1 0%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="name_tag"
                label="Name_tag"
                style={{ minWidth: "100%", flex: "1 1 0%" }}
              >
                <Input />
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
