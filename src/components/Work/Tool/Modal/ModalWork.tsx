/* eslint-disable react/jsx-key */
import usePostData from "@/hooks/usePostData";
import { ICreateWork } from "@/models/activityInterface";
import { fetchWorks } from "@/redux/store/slices/activitySlices/work.slide";
import { AppDispatch, RootState } from "@/redux/store/store";
import activityService from "@/services/activityService";
import {
  Avatar,
  Button,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  SelectProps,
  Tabs,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import TabPane from "antd/es/tabs/TabPane";
// import moment from "moment";
import React, { Ref, useEffect, useRef, useState } from "react";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ModalTypeWork from "./ModalTypeWork/ModalTypeWork";
import ModalStatusWork from "./ModalStatusWork/ModalStatusWork";
import ModalAddActivity from "@/components/Activity/Tool/Modal/ModalActivity";
import { fetchTypeWorksID } from "@/redux/store/slices/activitySlices/type_id_work.slice";
import { useParams, useSearchParams } from "next/navigation";

type Props = {
  idType?: string;
  idStatus?: string;
  type?: string;
  refBtnWork?: Ref<HTMLButtonElement>;
};

export default function ModalAddWork({
  idStatus,
  idType,
  refBtnWork,
  type,
}: Props) {
  const { Panel } = Collapse;
  // type TagRender = SelectProps['tagRender'];
  const { projectID } = useParams();
  const searchParams = useSearchParams();
  useEffect(()=>{
      if(searchParams)
      {
        const activity = searchParams.get('activity')
        if(activity){
          form.setFieldValue('activity',activity)
        }
      
  
      }
    },[searchParams])
  const refBtnType = useRef<HTMLButtonElement>();
  const refBtnStatus = useRef<HTMLButtonElement>();
  const refBtnActivity = useRef<HTMLButtonElement>();

  const { datas: dataTypeWork } = useSelector(
    (state: RootState) => state.get_type_work
  );

  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );

  const { datas: dataActivity } = useSelector(
    (state: RootState) => state.get_activities
  );
  const [tabChooseUser, setTabChooseUser] = useState<boolean>(false);
  const [optionsListUser, setOptionsListUser] = useState<
    SelectProps["options"]
  >([]);
  const [listUsers, setListUsers] = useState<string[]>([]);

  const [form] = useForm();
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [typeWork, setTypeWork] = useState<string>("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: ICreateWork) => {
    const res = await postdata(() =>
      activityService.createWork({ ...values, list_users: listUsers })
    );
    if (res === 200 || res === 201) {
      if (!type) {
        dispatch(fetchWorks({ project: projectID as string }));
      }
      if (type === "schedule") {
        dispatch(fetchTypeWorksID(idType as string));
      }
      setIsModalVisible(false);
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };

  // const tagRender: TagRender = (props)=>{
    
  //   const { label, value, closable, onClose } = props;
  //   console.log(value)
  //   return <>
  //     <p>{label}</p>
  //   </>
  // }

  useEffect(() => {
    if (idStatus && idType) {
      form.setFieldsValue({ status: idStatus, type: idType });
      setTypeWork(idType);
    }
  }, [idStatus, idType]);

  useEffect(() => {
    if (dataUsers) {
      setOptionsListUser(
        dataUsers.map((dt) => {
          return {
            label: dt.first_name + " " + dt.last_name,
            value: dt.user_id,
            group:dt.group_user?.name_group
          };
        })
      );
    }
  }, [dataUsers]);
  return (
    <>
      <Button
        hidden={refBtnWork ? true : false}
        type={type ? "link" : "default"}
        className={
          type
            ? "text-[#EC8920]"
            : "bg-blue-400 border-0 text-white font-semibold"
        }
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnWork}
      >
        Thêm công việc
      </Button>
      <Modal
        title="Tạo công việc"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin công việc" key={1}>
           
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >
              <Collapse defaultActiveKey={["1"]} className="w-full">
              <Panel header="Thông tin chung" key="1" className="w-full">
              <Form.Item
                name="name"
                label="Tên công việc"
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
              <div className="flex flex-wrap gap-3">
              <Form.Item
                name="time_start"
                label="Bắt đầu"
                className=" mb-0"
                // rules={[{ required: true }]}
                style={{ minWidth: "250px", flex: "1 1 0%" }}
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
                label="Kết thúc"
                name="time_end"
                rules={[{ required: true }]}
                style={{ minWidth: "250px", flex: "1 1 0%" }}
                // getValueProps={(value) => ({
                //   value: value ? moment(value) : null,
                // })}
              >
                <DatePicker
                  placeholder="Chọn ngày kết thúc"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              </div>
            
                <div className=" mt-8">
                  <p>Người thực hiện</p>
                  <div className="flex items-center gap-1">
              <Avatar.Group
                max={{
                  count: 5,
                  style: {
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                  },
                }}
              >
                {listUsers?.map((dt) => {
                  const dataFil = dataUsers?.find((dtt) => dtt.user_id === dt);
                  return (
                    <Tooltip
                      title={
                        dataFil?.first_name ?? "" + dataFil?.last_name ?? ""
                      }
                      placement="top"
                    >
                      <Avatar
                        src={dataFil?.picture_url}
                        alt={
                          dataFil?.first_name ?? "" + dataFil?.last_name ?? ""
                        }
                        style={{ backgroundColor: "#87d068" }}
                      />
                    </Tooltip>
                  );
                })}
              </Avatar.Group>
              {!tabChooseUser ? (
                <IoIosAddCircle
                  className="w-8 h-8 text-[#ED8C1F] cursor-pointer"
                  onClick={() => {
                    setTabChooseUser(!tabChooseUser);
                  }}
                />
              ) : (
                <>
                  <Select
                    mode="multiple"
                    onBlur={() => {
                      setTabChooseUser(!tabChooseUser);
                    }}
                    allowClear
                    maxTagCount={"responsive"}
                    style={{ width: "220px" }}
                    value={listUsers}
                    placeholder="Please select"
                    onChange={(e) => {
                      setListUsers(e);
                    }}
                    options={optionsListUser?.map((user) => ({
                      label: (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div>
                            <strong>{user.label}</strong>
                            <div style={{ fontSize: "12px", color: "gray" }}>{user.group}</div>
                          </div>
                        </div>
                      ),
                      value: user.value,
                    }))}
                  />
                  <IoIosCloseCircle
                    className="w-8 h-8 text-red-500 cursor-pointer"
                    onClick={() => {
                      setTabChooseUser(!tabChooseUser);
                    }}
                  />
                </>
              )}
            </div>
                </div>
              
              </Panel>
              <Panel header="Thông tin nâng cao" key="2">
              <Form.Item
                name="type"
                label="Loại công việc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại công việc!",
                  },
                ]}
                style={{ width: "100%", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn loại"
                  onChange={(e) => {
                    setTypeWork(e);
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
                  {dataTypeWork?.map((dt) => (
                    <Option key={dt.type_work_id} value={dt.type_work_id}>
                      {dt.name}
                    </Option>
                  ))}
                </Select>
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
                  {dataTypeWork
                    .find((dt) => dt.type_work_id === typeWork)
                    ?.status?.map((dt) => (
                      <Option key={dt.status_work_id} value={dt.status_work_id}>
                        {dt.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="activity"
                label="Hoạt động"
                // rules={[{ required: true }]}
                style={{ minWidth: "240px", flex: "1 1 0%" }}
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
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Button
                        type="link"
                        onClick={() => {
                          refBtnActivity.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataActivity?.map((dt) => (
                    <Option key={dt.activity_id} value={dt.activity_id}>
                      {dt.name}
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
              </Panel>
              </Collapse>
            
             
            </Form>
          </TabPane>
        </Tabs>

        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Tạo
          </Button>
        </div>
      </Modal>
      <ModalTypeWork refBtnType={refBtnType as Ref<HTMLButtonElement>} />
      <ModalStatusWork refBtnStatus={refBtnStatus as Ref<HTMLButtonElement>} />
      <ModalAddActivity
        refBtnActivity={refBtnActivity as Ref<HTMLButtonElement>}
      />
    </>
  );
}
