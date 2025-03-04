/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
import usePostData from "@/hooks/usePostData";
import { PlusOutlined } from "@ant-design/icons";
import { IGetWork2, IUpdateWork } from "@/models/activityInterface";
import { fetchWorks } from "@/redux/store/slices/activitySlices/work.slide";
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
  Tooltip,
  Upload,
  UploadFile,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import TabPane from "antd/es/tabs/TabPane";
import React, { Ref, useEffect, useRef, useState } from "react";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ModalTypeWork from "../ModalTypeWork/ModalTypeWork";
import ModalStatusWork from "../ModalStatusWork/ModalStatusWork";
import ModalAddActivity from "@/components/Activity/Tool/Modal/ModalActivity";
import { fetchTypeWorksID } from "@/redux/store/slices/activitySlices/type_id_work.slice";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import CustomFormData from "@/utils/CustomFormData";
import { onChangeImagePreview } from "@/redux/store/slices/image-preview.slice";

type Props = {
  ID: string;
  idType?: string;
  type?: string;
  refBtn?: React.Ref<HTMLButtonElement>;
  setID?: (value: React.SetStateAction<string>) => void;
};

export default function ModalUpdateWork({
  ID,
  idType,
  refBtn,
  setID,
  type,
}: Props) {
  const { projectID } = useParams();
  const [listImg, setListImg] = useState<UploadFile[]>([]);
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
    fetchData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if (setID) {
      setID("");
    }
  };

  const fetchData = async () => {
    const res = await activityService.getWorkById(ID);
    if (res.statusCode === 200) {
      const dataRes = res.data as IGetWork2;
      form.setFieldsValue({
        ...dataRes,
        type: dataRes.type.type_work_id,
        status: dataRes.status.status_work_id,
        activity: dataRes.activity?.activity_id,
      });
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
      setTypeWork(dataRes.type.type_work_id);
      setListUsers(dataRes.list_user?.map((dt) => dt.user_id) ?? []);
    }
  };

  const handleSubmit = async (values: IUpdateWork) => {
    const res = await postdata(() =>
      activityService.updateWork(ID, { ...values, list_users: listUsers })
    );
    if (res === 200 || res === 201) {
      dispatch(fetchWorks({ project: projectID as string }));
      setIsModalVisible(false);
      if (type === "schedule") {
        dispatch(fetchTypeWorksID(idType as string));
      }
    }
  };

  const handleChange = async (
    { file }: { file: UploadFile },
    type_image: boolean
  ) => {
    if (file?.url && file?.status === "removed") {
      const statusCode = await postdata(() =>
        activityService.deletePictureWork(file.uid)
      );
      if (statusCode === 200) {
        fetchData();
        if (type === "schedule") {
          dispatch(fetchTypeWorksID(idType as string));
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
          activityService.createPictureWork(dataForm)
        );
        if (statusCode === 201) {
          fetchData();
          if (type === "schedule") {
            dispatch(fetchTypeWorksID(idType as string));
          }
        }
      }
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };

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

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <>
      <Button
        hidden={type || refBtn ? true : false}
        className="  text-xs text-yellow-500 font-semibold"
        type="text"
        ref={refBtn}
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Cập nhật công việc"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin công việc" key={1}>
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
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
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
              <Form.Item
                name="time_start"
                initialValue=""
                className=" mb-0"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
                getValueFromEvent={(e: any) => e?.format("YYYY-MM-DD")}
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
                name="time_end"
                rules={[{ required: true }]}
                initialValue=""
                className=" mb-0"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
                getValueFromEvent={(e: any) => e?.format("YYYY-MM-DD")}
                getValueProps={(e: string) => ({
                  value: e ? dayjs(e) : "",
                })}
              >
                <DatePicker
                  placeholder="Chọn ngày kết thúc"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  allowClear
                />
              </Form.Item>
            </Form>
            <div className="my-2 flex flex-col gap-8">
              <div className="mb-2  pb-2">
                <div className="flex items-center text-xs font-medium text-[#EB8823] hover:opacity-85 cursor-pointer mb-2">
                  <p className="pointer-events-none">Ảnh đầu hoạt động</p>
                </div>
                <div
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
                    onChange={(e) => {
                      handleChange(e, true);
                    }}
                    onPreview={(e) => {
                      dispatch(onChangeImagePreview(e.url));
                    }}
                    multiple
                  >
                    {false ? null : uploadButton}
                  </Upload>
                </div>
              </div>
              <div>
                <div className="flex items-center text-xs font-medium text-[#EB8823] hover:opacity-85 cursor-pointer mb-2">
                  <p className="pointer-events-none">Ảnh sau hoạt động</p>
                </div>
                <div
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
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>

        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Cập nhật
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
