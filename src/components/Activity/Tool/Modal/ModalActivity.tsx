import usePostData from "@/hooks/usePostData";
import { ICreateActivity } from "@/models/activityInterface";
import { fetchActivities } from "@/redux/store/slices/activitySlices/activity.slice";
import { fetchTypeActivitiesID } from "@/redux/store/slices/activitySlices/type_id_activity.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import activityService from "@/services/activityService";
import { Button, Divider, Form, Input, Modal, Select, Tabs } from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import TabPane from "antd/es/tabs/TabPane";
import React, { Ref, useEffect, useRef, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ModalAddContract from "@/components/Contract/Tool/Modal/ModalContract";
import ModalTypeActivity from "./ModalTypeActivity/ModalTypeActivity";
import ModalStatusActivity from "./ModalStatusActivity/ModalStatusActivity";
import { useParams, useSearchParams } from "next/navigation";

type Props = {
  idType?: string;
  idStatus?: string;
  type?: string;
  refBtnActivity?: Ref<HTMLButtonElement>;
};

export default function ModalAddActivity({
  type,
  idType,
  idStatus,
  refBtnActivity,
}: Props) {
  const { projectID } = useParams();
  const searchParams = useSearchParams();
  const refBtnType = useRef<HTMLButtonElement>();
  const refBtnContract = useRef<HTMLButtonElement>();
  const refBtnStatus = useRef<HTMLButtonElement>();
  const { datas: dataTypeActivity } = useSelector(
    (state: RootState) => state.get_type_activities
  );

  const { datas: dataContracts } = useSelector(
    (state: RootState) => state.get_contracts
  );
  // useEffect(() => {
  //   if (projectID) {
  //     form.setFieldValue("contract", projectID);
  //   }
  // }, [projectID]);
   useEffect(()=>{
      if(searchParams)
      {
        const contract = searchParams.get('contract')
        if(contract){
          form.setFieldValue('contract',contract)
        }
        
  
      }
    },[searchParams])
  useEffect(() => {
    if (idStatus && idType) {
      form.setFieldsValue({ status: idStatus, type: idType });
      setTypeActivity(idType);
    }
  }, [idStatus, idType]);
  const [form] = useForm();
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [typeActivity, setTypeActivity] = useState<string>("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: ICreateActivity) => {
    const res = await postdata(() => activityService.createActivity(values));
    if (res === 200 || res === 201) {
      if (!type) {
        dispatch(fetchActivities({ project: projectID as string }));
      }
      if (type === "schedule") {
        dispatch(fetchTypeActivitiesID(idType as string));
      }
      setIsModalVisible(false);
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };

  return (
    <>
      <Button
        hidden={refBtnActivity ? true : false}
        type={type ? "link" : "default"}
        className={
          type
            ? "text-[#EC8920]"
            : "bg-blue-400 border-0 text-white font-semibold"
        }
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnActivity}
      >
        Thêm hoạt động
      </Button>
      <Modal
        title="Tạo hoạt động"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin hoạt đồng" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >
              <Form.Item
                name="type"
                label="Loại hoạt động"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại hoạt động!",
                  },
                ]}
                style={{ width: "100%", flex: "1 1 0%" }}
              >
                <Select
                  disabled={idType ? true : false}
                  placeholder="Chọn loại"
                  onChange={(e) => {
                    setTypeActivity(e);
                  }}
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Button
                        type="link"
                        onClick={() => {
                          refBtnType.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataTypeActivity?.map((dt) => (
                    <Option
                      key={dt.type_activity_id}
                      value={dt.type_activity_id}
                    >
                      {dt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="name"
                label="Tên hoạt động"
                rules={[
                  {
                    required: true,
                    type: "string",
                    message: "Vui lòng nhập tên hoạt động",
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
                  disabled={idStatus ? true : false}
                  placeholder="Chọn loại"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Button
                        type="link"
                        onClick={() => {
                          refBtnStatus.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataTypeActivity
                    .find((dt) => dt.type_activity_id === typeActivity)
                    ?.status?.map((dt) => (
                      <Option
                        key={dt.status_activity_id}
                        value={dt.status_activity_id}
                      >
                        {dt.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="contract"
                label="Hợp đồng"
                // rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn hợp đồng"
                  showSearch
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.children)
                      ? option.children.join("")
                      : option?.children ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Button
                        type="link"
                        onClick={() => {
                          refBtnContract.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataContracts?.map((dt) => (
                    <Option key={dt.contract_id} value={dt.contract_id}>
                      {dt.name_contract}
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
            Tạo
          </Button>
        </div>
      </Modal>
      <ModalAddContract
        refBtnContract={refBtnContract as Ref<HTMLButtonElement>}
      />
      <ModalTypeActivity refBtnType={refBtnType as Ref<HTMLButtonElement>} />
      <ModalStatusActivity
        refBtnStatus={refBtnStatus as Ref<HTMLButtonElement>}
      />
    </>
  );
}
