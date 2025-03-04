/* eslint-disable react/jsx-key */
import usePostData from "@/hooks/usePostData";
import {
  ICreateWork,
  IGetActivity,
  IGetStatusActivity,
  IGetWork,
} from "@/models/activityInterface";
import { PlusOutlined } from "@ant-design/icons";
import { fetchActivities } from "@/redux/store/slices/activitySlices/activity.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import activityService from "@/services/activityService";
import {
  Avatar,
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  SelectProps,
  Tabs,
  Tag,
  Tooltip,
  Upload,
  UploadFile,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import TabPane from "antd/es/tabs/TabPane";
import React, { Ref, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { Step, StepLabel, Stepper } from "@mui/material";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import { Moment } from "moment";
import CustomFormData from "@/utils/CustomFormData";
import { fetchTypeActivitiesID } from "@/redux/store/slices/activitySlices/type_id_activity.slice";
import ModalAddContract from "@/components/Contract/Tool/Modal/ModalContract";
import ModalTypeActivity from "../ModalTypeActivity/ModalTypeActivity";
import ModalStatusActivity from "../ModalStatusActivity/ModalStatusActivity";
import ModalStatusWork from "@/components/Work/Tool/Modal/ModalStatusWork/ModalStatusWork";
import ModalTypeWork from "@/components/Work/Tool/Modal/ModalTypeWork/ModalTypeWork";
import dayjs from "dayjs";
import ModalUpdateWork from "@/components/Work/Tool/Modal/ModalUpdateWork/ModalUpdateWork";
import { onChangeImagePreview } from "@/redux/store/slices/image-preview.slice";

type Props = {
  ID: string;
  idType?: string;
  type?: string;
  refBtn?: React.Ref<HTMLButtonElement>;
  setID?: (value: React.SetStateAction<string>) => void;
  fetchData?: () => void;
};

export default function ModalWordStatus({
  ID,
  idType,
  type,
  refBtn,
  setID,
  fetchData: fetchDataAdd,
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

  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );

  const { datas: dataTypeWork } = useSelector(
    (state: RootState) => state.get_type_work
  );

  const [optionsListUser, setOptionsListUser] = useState<
    SelectProps["options"]
  >([]);
  const [form] = useForm();
  const [formAddWork] = useForm();
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();
  const [listImg, setListImg] = useState<UploadFile[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [tabChooseUser, setTabChooseUser] = useState<boolean>(false);
  const [dataWorks, setDataWorks] = useState<IGetWork[]>([]);
  const [tabAddWork, setTabAddWork] = useState<boolean>(false);
  const [listUsers, setListUsers] = useState<string[]>([]);
  const [typeActivity, setTypeActivity] = useState<string>("");
  const [typeWork, setTypeWork] = useState<string>("");
  const [statusActivity, setStatusActivity] = useState<IGetStatusActivity[]>(
    []
  );
  const [statusChoose, setStatusChoose] = useState<number>(-1);

  const showModal = () => {
    setIsModalVisible(true);
    fetchData();
  };
  const fetchData = async () => {
    const res = await activityService.getActivityById(ID);
    if (res.statusCode === 200) {
      const dataRes = res.data as IGetActivity;
      form.setFieldsValue(dataRes);
      setListImg(
        (dataRes.picture_urls?.map((dt) => {
          return {
            uid: dt.picture_id,
            name: dt.type,
            status: "done",
            url: dt.url,
          };
        }) as UploadFile[]) ?? []
      );
      setTypeActivity(res.data.type);
      setDataWorks(dataRes?.works ?? []);
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    if (setID) {
      setID("");
    }
  };

  const handleSubmitCreateWork = async (values: ICreateWork) => {
    const statusCode = await postdata(() =>
      activityService.createWork({
        ...values,
        activity: ID,
        list_users: listUsers,
      })
    );
    if (statusCode === 201) {
      setTabAddWork(!tabAddWork);
      setListUsers([]);
      formAddWork.resetFields();
      fetchData();
      dispatch(fetchActivities({}));
      if (fetchDataAdd) fetchDataAdd();
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

  useEffect(() => {
    if (statusActivity.length > 0) {
      const index = statusActivity.findIndex(
        (dt) => dt.status_activity_id === form.getFieldValue("status")
      );
      setStatusChoose(index);
    }
  }, [form, statusActivity]);

  useEffect(() => {
    if (dataUsers) {
      setOptionsListUser(
        dataUsers.map((dt) => {
          return {
            label: dt.first_name + " " + dt.last_name,
            value: dt.user_id,
          };
        })
      );
    }
  }, [dataUsers]);

  const handleUpdateStatus = async (status: string) => {
    const statusCode = await postdata(() =>
      activityService.updateStatus(ID, { status })
    );
    if (statusCode === 200) {
      fetchData();
      dispatch(fetchActivities({}));
      const index = statusActivity.findIndex(
        (dt) => dt.status_activity_id === status
      );
      setStatusChoose(index);
    }
  };

  const handleChange = async (
    { file }: { file: UploadFile },
    type_image: boolean
  ) => {
    if (file?.url && file?.status === "removed") {
      const statusCode = await postdata(() =>
        activityService.deletePictureActivity(file.uid)
      );
      if (statusCode === 200) {
        fetchData();
        if (type === "schedule") {
          dispatch(fetchTypeActivitiesID(idType as string));
        }
      }
    } else {
      const dataReq = {
        activity: ID,
        url: [file.originFileObj as File],
        type: type_image ? "start" : "end",
      };
      if (dataReq) {
        const dataForm = CustomFormData(dataReq);
        const statusCode = await postdata(() =>
          activityService.createPictureActivity(dataForm)
        );
        if (statusCode === 201) {
          fetchData();
          if (type === "schedule") {
            dispatch(fetchTypeActivitiesID(idType as string));
          }
        }
      }
    }
  };
  useEffect(() => {
    if (idWork !== "") {
      refBtnUpdateWork.current?.click();
    }
  }, [idWork]);
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

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
        Chỉnh sửa công việc
      </Button>
      {/* )} */}

      <Modal
        title="Cập nhật tiến độ công việc"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Trạng thái hoạt động" key={1}>
            <div hidden={type ? true : false}>
              <Stepper alternativeLabel activeStep={statusChoose}>
                {statusActivity.map((label, index) => (
                  <Step key={label.status_activity_id}>
                    <StepLabel
                      sx={{
                        "& .MuiStepLabel-label": {
                          color:
                            index === statusChoose
                              ? "#00A9AE"
                              : "gray !important", // Đổi màu text
                        },
                        "& .MuiStepIcon-root": {
                          color:
                            index === statusChoose
                              ? "#00A9AE !important"
                              : "gray !important", // Đổi màu icon
                        },
                        "& .Mui-active": {
                          color: "#00A9AE !important",
                        },
                        "& .Mui-completed": {
                          color: "#00A9AE !important", // Màu cho bước đã hoàn thành
                        },
                      }}
                      className={
                        index > statusChoose
                          ? "!cursor-pointer"
                          : "pointer-events-none"
                      }
                      onClick={() => {
                        handleUpdateStatus(label.status_activity_id);
                      }}
                    >
                      <p className="text-sm cursor-pointer">{label.name}</p>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
            <div className="border-y-[1px] py-4 my-2 flex flex-col gap-2">
              <div
                className="flex items-center text-xs font-medium text-[#EB8823] hover:opacity-85 cursor-pointer"
                onClick={() => {
                  setTabAddWork(!tabAddWork);
                }}
              >
                <IoIosAddCircle />
                <p className="pointer-events-none">Thêm công việc</p>
              </div>
              <div
                className="hover:border-[#00A9AE] border-black/10 border-[1px]  px-1 py-2 rounded-md"
                hidden={!tabAddWork}
              >
                <div className="flex mb-2 items-center gap-1">
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
                      const dataFil = dataUsers?.find(
                        (dtt) => dtt.user_id === dt
                      );
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
                              dataFil?.first_name ??
                              "" + dataFil?.last_name ??
                              ""
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
                        options={optionsListUser}
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
                <Form
                  form={formAddWork}
                  onFinish={handleSubmitCreateWork}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <Form.Item
                    name="name"
                    rules={[
                      { required: true, message: "Please enter the Work Name" },
                    ]}
                    className="flex-1 mb-0 min-w-full"
                  >
                    <Input type="none" placeholder="Tên công việc" />
                  </Form.Item>
                  <Form.Item
                    name="type"
                    rules={[
                      { required: true, message: "Please enter the Work Name" },
                    ]}
                    className="flex-1 mb-0 min-w-80"
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
                              refBtnTypeWork.current?.click();
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
                    rules={[
                      { required: true, message: "Please enter the Work Name" },
                    ]}
                    className="flex-1 mb-0 min-w-80"
                  >
                    <Select
                      placeholder="Trạng thái"
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
                              refBtnStatusWork.current?.click();
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
                          <Option
                            key={dt.status_work_id}
                            value={dt.status_work_id}
                          >
                            {dt.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="time_start"
                    initialValue=""
                    className=" mb-0"
                    style={{ minWidth: "320px", flex: "1 1 0%" }}
                    getValueFromEvent={(e: Moment) => e?.format("YYYY-MM-DD")}
                    getValueProps={(e: string) => ({
                      value: e ? dayjs(e) : "",
                    })}
                  >
                    <DatePicker
                      placeholder="Chọn ngày bắt đầu"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    className=" mb-0"
                    name="time_end"
                    initialValue=""
                    style={{ minWidth: "320px", flex: "1 1 0%" }}
                    getValueFromEvent={(e: Moment) => e?.format("YYYY-MM-DD")}
                    getValueProps={(e: string) => ({
                      value: e ? dayjs(e) : "",
                    })}
                  >
                    <DatePicker
                      placeholder="Chọn ngày kết thúc"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    style={{ width: "100%" }}
                    className=" mb-0"
                  >
                    <Input.TextArea
                      placeholder="Description"
                      autoSize={{ minRows: 3 }}
                    />
                  </Form.Item>
                  <Form.Item
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "end",
                      margin: "0",
                    }}
                  >
                    <Button
                      className=" text-white font-semibold"
                      style={{ background: "#00A9AE" }}
                      // onClick={handleAddProduct}
                      htmlType="submit"
                    >
                      Thêm
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                {dataWorks.map((dt) => {
                  return (
                    <>
                      <div
                        className="flex flex-wrap gap-2 justify-between shadow-md bg-gray-400/5 p-4 rounded-sm cursor-pointer"
                        onClick={() => {
                          setIDWork(dt.work_id);
                        }}
                      >
                        <div className="flex flex-col justify-between gap-1">
                          <p className="text-[#00A9AE] font-semibold text-lg">
                            {dt.name}
                          </p>
                          <p className="text-black/60 text-xs">
                            {(dt.description ?? "")?.length > 50
                              ? `${dt.description?.slice(0, 50)}...`
                              : dt.description}
                          </p>
                          <div className="flex text-xs font-medium gap-2">
                            <p>
                              {new Date(dt.time_start).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                            <span>-</span>
                            <p>
                              {new Date(dt.time_end).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                          <Tag color="green">{dt.status.name}</Tag>
                          <div className="max-h-6">
                            <Avatar.Group
                              max={{
                                count: 2,
                                style: {
                                  color: "#f56a00",
                                  backgroundColor: "#fde3cf",
                                },
                              }}
                            >
                              {dt?.list_user?.map((dtt) => {
                                const dataFil = dataUsers?.find(
                                  (dttt) => dttt.user_id === dtt.user
                                );
                                console.log(dataFil);
                                return (
                                  <Tooltip
                                    title={
                                      dataFil?.first_name ??
                                      "" + dataFil?.last_name ??
                                      ""
                                    }
                                    placement="top"
                                  >
                                    <Avatar
                                      src={dataFil?.picture_url}
                                      alt={
                                        dataFil?.first_name ??
                                        "" + dataFil?.last_name ??
                                        ""
                                      }
                                      style={{ backgroundColor: "#87d068" }}
                                    />
                                  </Tooltip>
                                );
                              })}
                            </Avatar.Group>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
            <div className="mb-2  pb-2">
              <div className="flex items-center text-xs font-medium text-[#EB8823] hover:opacity-85 cursor-pointer mb-2">
                <p className="pointer-events-none">Ảnh đầu hoạt động</p>
              </div>
              <Form.Item
                // valuePropName="fileList"
                // getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                className="!m-0"
                // rules={[{ required: false, message: "Vui lòng chọn loại thuế!" }]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Upload
                  action=""
                  listType="picture-card"
                  fileList={listImg.filter((dt) => dt.name === "start")}
                  onPreview={(e) => {
                    dispatch(onChangeImagePreview(e.url));
                  }}
                  onChange={(e) => {
                    handleChange(e, true);
                  }}
                  multiple
                >
                  {false ? null : uploadButton}
                </Upload>
                {/* {previewImage && (
              <Image
                alt="ha"
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )} */}
              </Form.Item>
            </div>
            <div>
              <div className="flex items-center text-xs font-medium text-[#EB8823] hover:opacity-85 cursor-pointer mb-2">
                <p className="pointer-events-none">Ảnh sau hoạt động</p>
              </div>
              <Form.Item
                // valuePropName="fileList"
                // getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                className="!m-0"
                // rules={[{ required: false, message: "Vui lòng chọn loại thuế!" }]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Upload
                  action=""
                  listType="picture-card"
                  fileList={listImg.filter((dt) => dt.name === "end")}
                  onPreview={(e) => {
                    dispatch(onChangeImagePreview(e.url));
                  }}
                  onChange={(e) => {
                    handleChange(e, false);
                  }}
                  multiple
                >
                  {false ? null : uploadButton}
                </Upload>
                {/* {previewImage && (
              <Image
                alt="ha"
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )} */}
              </Form.Item>
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
