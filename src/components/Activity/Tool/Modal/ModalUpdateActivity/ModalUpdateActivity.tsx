/* eslint-disable react/jsx-key */
import usePostData from "@/hooks/usePostData";
import {
  IGetActivity,
  IGetStatusActivity,
  IUpdateActivity,
} from "@/models/activityInterface";
import { fetchActivities } from "@/redux/store/slices/activitySlices/activity.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import activityService from "@/services/activityService";
import { Button, Divider, Form, Input, Modal, Select, Tabs } from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import TabPane from "antd/es/tabs/TabPane";
import React, { Ref, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { fetchTypeActivitiesID } from "@/redux/store/slices/activitySlices/type_id_activity.slice";
import ModalAddContract from "@/components/Contract/Tool/Modal/ModalContract";
import ModalTypeActivity from "../ModalTypeActivity/ModalTypeActivity";
import ModalStatusActivity from "../ModalStatusActivity/ModalStatusActivity";
import ModalStatusWork from "@/components/Work/Tool/Modal/ModalStatusWork/ModalStatusWork";
import ModalTypeWork from "@/components/Work/Tool/Modal/ModalTypeWork/ModalTypeWork";
import { useParams } from "next/navigation";
import ModalUpdateWork from "@/components/Work/Tool/Modal/ModalUpdateWork/ModalUpdateWork";

type Props = {
  ID: string;
  idType?: string;
  type?: string;
  refBtn?: React.Ref<HTMLButtonElement>;
  setID?: (value: React.SetStateAction<string>) => void;
  fetchData?: () => void;
};

export default function ModalUpdateActivity({
  ID,
  idType,
  type,
  refBtn,
  setID,
}: Props) {
  const refBtnType = useRef<HTMLButtonElement>();
  const refBtnContract = useRef<HTMLButtonElement>();
  const refBtnStatus = useRef<HTMLButtonElement>();
  const refBtnTypeWork = useRef<HTMLButtonElement>();
  const refBtnStatusWork = useRef<HTMLButtonElement>();
  const refBtnUpdateWork = useRef<HTMLButtonElement>();
  const [idWork, setIDWork] = useState<string>("");
  const { datas: dataTypeActivity } = useSelector(
    (state: RootState) => state.get_type_activities
  );

  const { datas: dataContracts } = useSelector(
    (state: RootState) => state.get_contracts
  );
  const { projectID } = useParams();
  const [form] = useForm();
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [typeActivity, setTypeActivity] = useState<string>("");
  const [statusActivity, setStatusActivity] = useState<IGetStatusActivity[]>(
    []
  );

  const showModal = () => {
    setIsModalVisible(true);
    fetchData();
  };
  const fetchData = async () => {
    const res = await activityService.getActivityById(ID);
    if (res.statusCode === 200) {
      const dataRes = res.data as IGetActivity;
      form.setFieldsValue(dataRes);

      setTypeActivity(res.data.type);
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    if (setID) {
      setID("");
    }
  };

  useEffect(() => {
    if (typeActivity) {
      setStatusActivity(
        dataTypeActivity.find((dt) => dt.type_activity_id === typeActivity)
          ?.status ?? []
      );
    }
  }, [typeActivity]);

  const handleSubmit = async (values: IUpdateActivity) => {
    console.log(ID);
    const res = await postdata(() =>
      activityService.updateActivity(ID, values)
    );
    if (res === 200 || res === 201) {
      fetchData();
      if (!type) {
        dispatch(fetchActivities({ project: projectID as string }));
      }
      if (type === "schedule") {
        dispatch(fetchTypeActivitiesID(idType as string));
      }
      if (type === "gantt" && setID) {
        dispatch(fetchActivities({}));
        setID("" as string);
      }
      // setIsModalVisible(false);
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };

  useEffect(() => {
    if (idWork !== "") {
      refBtnUpdateWork.current?.click();
    }
  }, [idWork]);

  return (
    <>
      {/* {!type && ( */}
      <Button
        hidden={type ? true : false}
        className="  text-xs text-yellow-500 font-semibold"
        type="text"
        ref={refBtn}
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      {/* )} */}

      <Modal
        title="Cập nhật hoạt động"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin hoạt động" key={1}>
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
                  disabled={true}
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
                  disabled={true}
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
                  {statusActivity?.map((dt) => (
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
                label="Hợp động"
                // rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn hợp động"
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
            <div className="flex justify-end w-full mt-4">
              <Button type="primary" onClick={btnSubmit}>
                Cập nhật
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
      <ModalAddContract
        refBtnContract={refBtnContract as Ref<HTMLButtonElement>}
      />
      <ModalTypeActivity refBtnType={refBtnType as Ref<HTMLButtonElement>} />
      <ModalStatusActivity
        refBtnStatus={refBtnStatus as Ref<HTMLButtonElement>}
      />
      <ModalStatusWork
        refBtnStatus={refBtnStatusWork as Ref<HTMLButtonElement>}
      />
      <ModalTypeWork refBtnType={refBtnTypeWork as Ref<HTMLButtonElement>} />
      <ModalUpdateWork
        ID={idWork}
        refBtn={refBtnUpdateWork as Ref<HTMLButtonElement>}
        setID={setIDWork}
      />
    </>
  );
}
