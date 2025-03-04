/* eslint-disable @typescript-eslint/no-explicit-any */
import RoleUser from "@/components/User/Role/Role";
import usePostData from "@/hooks/usePostData";
import { CreateUser, InfoUser } from "@/models/userInterface";
import { fetchUserProfile } from "@/redux/store/slices/userSlices/get_profile.slice";
import { fetchUserInfo } from "@/redux/store/slices/userSlices/get_users.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import userService from "@/services/userService";
import { BsSkype } from "react-icons/bs";
import CustomFormData from "@/utils/CustomFormData";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Tabs,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { Option } from "antd/es/mentions";
import TabPane from "antd/es/tabs/TabPane";
import React, { Ref, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ModalGroupUser from "../ModalGroupUser/ModalGroupUser";
import { FiPhone, FiUser } from "react-icons/fi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { onChangeImagePreview } from "@/redux/store/slices/image-preview.slice";
import useCheckRole from "@/utils/CheckRole";
import { fetchUserFilter } from "@/redux/store/slices/userSlices/get_filter_user.slice";

type Props = {
  ID: string;
  refBtnUser?: Ref<HTMLButtonElement>;
};

export default function ModalUpdateUser({ ID, refBtnUser }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useCheckRole([
    "admin-top",
    "user",
    "user-edit",
    "user-read",
  ]);
  const refBtnGroup = useRef<HTMLButtonElement>();
  const { datas: dataGroup } = useSelector(
    (state: RootState) => state.get_group_user
  );
  const refBtn = useRef<HTMLButtonElement>();
  const [form] = useForm();

  const { postdata } = usePostData();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [filePicture, setFilePicture] = useState<UploadFile[]>([]);
  const [dataProfile, setDataProfile] = useState<InfoUser>();

  const showModal = async () => {
    setIsModalVisible(true);
    fetchData();
  };

  const fetchData = async () => {
    const res = isAuthorized
      ? await userService.getUserIDAdmin(ID)
      : await userService.getUserIDAdminByUser();
    if (res.statusCode === 200) {
      form.setFieldsValue({
        ...res.data,
        group_user: res?.data?.group_user?.group_id,
      });
      setDataProfile(res?.data);
      setFilePicture([
        {
          uid: res.data.user_id,
          name: "logo.png",
          status: "done",
          url: res.data.picture_url,
        },
      ]);
      if (isAuthorized) dispatch(fetchUserFilter({}));
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleChange: UploadProps["onChange"] = ({ file: newFileList }) => {
    if (newFileList.status === "removed") {
      setFilePicture([]);
    } else {
      setFilePicture([newFileList]);
    }
  };

  const handleSubmit = async (values: CreateUser) => {
    const formdata = CustomFormData(
      Object.entries({
        ...values,
        picture_url:
          filePicture.length > 0
            ? [filePicture?.[0]?.originFileObj as File]
            : null,
      }).reduce((acc: any, [key, value]) => {
        if (value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {})
    );
    if (isAuthorized) {
      const res = await postdata(() => userService.updateUser(ID, formdata));
      refBtn.current?.click();
      if (res === 200 || res === 201) {
        setIsModalVisible(false);
        dispatch(fetchUserInfo());
        dispatch(fetchUserProfile());
        form.resetFields();
      }
    } else {
      const res = await postdata(() => userService.updateUserProfile(formdata));
      refBtn.current?.click();
      if (res === 200 || res === 201) {
        setIsModalVisible(false);
        dispatch(fetchUserProfile());
        form.resetFields();
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
        className="  text-xs text-yellow-500 font-semibold"
        type="text"
        hidden={refBtnUser ? true : false}
        ref={refBtnUser}
        onClick={showModal}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title={refBtnUser ? "Hồ sơ của bạn" : "Cập nhật nhân viên"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <div className="flex w-full h-fit items-center justify-start gap-2 sm:gap-4  capitalize p-4 bg-[#21A49B] text-white rounded-md">
          <div className="w-fit">
            <Image
              className="rounded-full sm:flex-none"
              width={80}
              height={80}
              alt=""
              src={dataProfile?.picture_url}
            />
          </div>

          <div className="flex flex-col h-full">
            <p className="font-bold text-xl sm:text-2xl w-fit ">
              {dataProfile?.first_name} {dataProfile?.last_name}
            </p>
            <div className="flex gap-x-4 flex-wrap sm:text-base text-sm">
              <div className="flex gap-1 items-center">
                <FiUser />
                <p>{dataProfile?.group_user?.name_group}</p>
              </div>
              <div className="flex gap-1 items-center">
                <MdOutlineAlternateEmail />
                <p>{dataProfile?.email}</p>
              </div>
              <div className="flex gap-1 items-center">
                <FiPhone />
                <p>{dataProfile?.phone_number}</p>
              </div>
            </div>
            <div className="flex gap-x-2 flex-wrap text-2xl">
              <Button
                type="link"
                className="shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-full"
                icon={<FaFacebook color="#0866FF" />}
                onClick={() => {
                  window.open(dataProfile?.link_facebook ?? "#", "_blank");
                }}
              />
              <Button
                type="link"
                className="shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-full"
                icon={
                  <BsSkype
                    color="#01A9E8"
                    onClick={() => {
                      window.open(dataProfile?.link_skype ?? "#", "_blank");
                    }}
                  />
                }
              />
              <Button
                type="link"
                className="shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-full"
                icon={
                  <FaLinkedin
                    color="#0A66C2"
                    onClick={() => {
                      window.open(dataProfile?.link_in ?? "#", "_blank");
                    }}
                  />
                }
              />
            </div>
          </div>
        </div>
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin nhân viên" key={1}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >
              <Form.Item
                name="group_user"
                label="Phòng ban"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phòng ban!",
                  },
                ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Select
                  placeholder="Chọn phòng ban"
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
                          refBtnGroup.current?.click();
                        }}
                      >
                        + Thêm tùy chọn mới
                      </Button>
                    </>
                  )}
                >
                  {dataGroup?.map((dt) => (
                    <Option key={dt.group_id} value={dt.group_id}>
                      {dt.name_group}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Vui lòng nhập email hợp lệ!",
                  },
                  {
                    max: 50,
                    message: "Email không được vượt quá 50 ký tự!",
                  },
                ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                // rules={[
                //   {
                //     required: true,
                //     message: "Vui lòng nhập mật khẩu!",
                //   },
                //   {
                //     min: 1,
                //     max: 50,
                //     message: "Mật khẩu phải từ 1 đến 50 ký tự!",
                //   },
                // ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item
                name="first_name"
                label="Họ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ!",
                  },
                  {
                    min: 1,
                    max: 20,
                    message: "Họ phải từ 1 đến 20 ký tự!",
                  },
                ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input placeholder="Nhập họ" />
              </Form.Item>

              <Form.Item
                name="last_name"
                label="Tên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên!",
                  },
                  {
                    min: 1,
                    max: 20,
                    message: "Tên phải từ 1 đến 20 ký tự!",
                  },
                ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input placeholder="Nhập tên" />
              </Form.Item>

              <Form.Item
                name="phone_number"
                label="Số điện thoại"
                rules={[
                  {
                    type: "string",
                    required: false,
                  },
                ]}
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                name="link_facebook"
                label="Facebook"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input placeholder="Nhập URL Facebook" defaultValue={""} />
              </Form.Item>

              <Form.Item
                name="link_in"
                label="LinkedIn"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input placeholder="Nhập URL LinkedIn" defaultValue={""} />
              </Form.Item>

              <Form.Item
                name="link_skype"
                label="Skype"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input placeholder="Nhập URL Skype" defaultValue={""} />
              </Form.Item>
              <Form.Item
                name="picture_url"
                label="Ảnh đại diện"
                className="!m-0"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Upload
                  maxCount={1}
                  action=""
                  listType="picture-card"
                  fileList={filePicture}
                  onPreview={(e) => {
                    dispatch(onChangeImagePreview(e.url));
                  }}
                  onChange={handleChange}
                >
                  {filePicture.length > 0 ? null : uploadButton}
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
              {/* <Form.Item
                name="sign_name"
                style={{ minWidth: "320px", flex: "1 1 0%" }}
              >
                <Input placeholder="Nhập chữ ký" />
              </Form.Item> */}
            </Form>
          </TabPane>
          <TabPane tab="Quyền hạn" key={2}>
            <RoleUser
              ID={ID}
              refBtn={refBtn as Ref<HTMLButtonElement>}
              group_user={form.getFieldValue("group_user")}
            />
          </TabPane>
        </Tabs>
        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Cập nhật
          </Button>
        </div>
      </Modal>
      <ModalGroupUser refBtnGroup={refBtnGroup as Ref<HTMLButtonElement>} />
    </>
  );
}
