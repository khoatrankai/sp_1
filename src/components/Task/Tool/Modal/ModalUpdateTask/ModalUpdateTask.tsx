/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
import usePostData from "@/hooks/usePostData";
import { PlusOutlined } from "@ant-design/icons";
import { IGetTask, IUpdateTask } from "@/models/activityInterface";
import { AppDispatch } from "@/redux/store/store";
import activityService from "@/services/activityService";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Tabs,
  Upload,
  UploadFile,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import TabPane from "antd/es/tabs/TabPane";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import CustomFormData from "@/utils/CustomFormData";
import { onChangeImagePreview } from "@/redux/store/slices/image-preview.slice";

type Props = {
  refBtn?: React.Ref<HTMLButtonElement>;
  ID:string
};

export default function ModalUpdateTask
({
  refBtn,ID
}: Props) {
  const [listImg, setListImg] = useState<UploadFile[]>([]);
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
    const res = await activityService.getTaskkById(ID as string);
    if (res.statusCode === 200) {
      const dataRes = res.data as IGetTask;
      form.setFieldsValue({
        ...dataRes,
        work: dataRes.work?.work_id,
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
    }
  };

  const handleSubmit = async (values: IUpdateTask) => {
    const res = await postdata(() =>
      activityService.updateTask(ID, { ...values})
    );
    if (res === 200 || res === 201) {
      setIsModalVisible(false);
    
    }
  };

  const handleChange = async (
    { file }: { file: UploadFile },
    type_image: boolean
  ) => {
    if (file?.url && file?.status === "removed") {
      await postdata(() =>
        activityService.deletePictureWork(file.uid)
      );
    } else {
      const dataReq = {
        activity: ID,
        url: [file.originFileObj as File],
        type: type_image ? "start" : "end",
      };
      if (dataReq) {
        const dataForm = CustomFormData(dataReq);
        await postdata(() =>
          activityService.createPictureTask(dataForm)
        );
        
      }
    }
  };

  const btnSubmit = async () => {
    form.submit();
  };


  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <>
      <Button
        hidden={ refBtn ? true : false}
        className="  text-xs text-yellow-500 font-semibold"
        type="text"
        ref={refBtn}
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Cập nhật task"
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
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
          
              <Form.Item
                name="name"
                label="Tên task"
                rules={[
                  {
                    required: true,
                    type: "string",
                    message: "Vui lòng nhập tên task",
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
     
    </>
  );
}
