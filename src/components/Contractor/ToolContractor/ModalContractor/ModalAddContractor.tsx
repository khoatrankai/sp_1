/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from "@/hooks/usePostData";
import { AppDispatch, RootState } from "@/redux/store/store";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import { Option } from "antd/es/mentions";
// import SubMenu from "antd/es/menu/SubMenu";
import React, { Ref, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";
import { useForm } from "antd/es/form/Form";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchContractors } from "@/redux/store/slices/projectSlices/get_contractor.slice";
import { ICreateContractor } from "@/models/projectInterface";
import projectService from "@/services/projectService";
import ModalAddProject from "@/components/Project/Tool/Modal/ModalAddProject";

type Props = {
  refBtnContractors?: Ref<HTMLButtonElement>;
};

export default function ModalAddContractor({ refBtnContractors }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const refBtn = useRef<HTMLButtonElement>()
  const refBtnProject = useRef<HTMLButtonElement>()
  const { postdata } = usePostData();

  const [form] = useForm();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { datas: dataProjects } = useSelector(
    (state: RootState) => state.get_projects
  );
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

 
  const handleSubmit = async (values: ICreateContractor) => {
   
    const res = await postdata(() =>
      projectService.createContractor(values)
    );
    if (res === 200 || res === 201) {
      form.resetFields();
      setIsModalVisible(false);
      dispatch(fetchContractors())
    }
  };


  return (
    <>
      <Button
        hidden={refBtnContractors ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnContractors}
      >
        Thêm nhà thầu
      </Button>
      <Modal
        title="Tạo nhà thầu"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Button
        onClick={()=>{refBtn.current?.click()}}
        icon={<MdOutlineDocumentScanner />}
      >
        Quét cccd
      </Button>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          form={form}
          style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
        >
          {/* <Menu
            mode="inline"
            style={{ width: "100%" }}
            defaultOpenKeys={["info"]}
          >
            <SubMenu title="Thông tin khách hàng" key="info"> */}
          <div className="flex flex-wrap gap-2 h-fit w-fit rounded-lg p-1">
           
            <Form.Item
              name="name"
              className="!m-0"
              label="Tên nhà thầu"
              rules={[
                { required: true, message: "Vui lòng nhập tên!" },
              ]}
              style={{ minWidth: "320px", flex: "1 1 0%" }}
            >
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Số điện thoại">
              <Input placeholder="Số điện thoại" maxLength={20} />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
              <Input placeholder="Email (nếu có)" />
            </Form.Item>

            <Form.Item name="address" label="Địa chỉ">
              <Input placeholder="Địa chỉ" />
            </Form.Item>

            <Form.Item name="tax_code" label="Mã số thuế">
              <Input placeholder="Mã số thuế" />
            </Form.Item>


            <Form.Item
              name="rating"
              label="Đánh giá"
              rules={[
                { type: "number", min: 0, max: 5, message: "Từ 0 đến 5 sao" },
              ]}
            >
              <InputNumber
                placeholder="0 - 5"
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              name="customer"
              label="Khách hàng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập nhóm khách hàng!",
                },
              ]}
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
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Button
                      type="link"
                      onClick={() => {
                        refBtnProject.current?.click();
                      }}
                    >
                      + Thêm tùy chọn mới
                    </Button>
                  </>
                )}
              >
                {dataProjects?.map((dt) => (
                  <Option key={dt.project_id} value={dt.project_id}>
                    {dt.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            
             <Form.Item
                            name="notes"
                            label="Ghi chú"
                            style={{ width: "100%" }}
                          >
                            <Input.TextArea
                              placeholder="Note"
                              autoSize={{ minRows: 3 }}
                            />
                          </Form.Item>
          </div>
          {/* </SubMenu> */}
          {/* <SubMenu title="Thông tin giao hàng" key="info_address">
              <div className="flex flex-wrap gap-2 h-fit w-fit rounded-lg p-1">
                <Form.Item
                  name="address_payment"
                  label="Địa chỉ thanh toán"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ thanh toán!",
                    },
                  ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="province_payment"
                  label="Tỉnh/Thành phố thanh toán"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tỉnh/thành phố thanh toán!",
                    },
                  ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Select placeholder="Chọn khu vực">
                    {dataProvinces?.map((dt) => (
                      <Option key={dt.province_id} value={dt.province_id}>
                        {dt.name_province}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="address_delivery"
                  label="Địa chỉ giao hàng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ giao hàng!",
                    },
                  ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="province_delivery"
                  label="Tỉnh/Thành phố giao hàng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tỉnh/thành phố giao hàng!",
                    },
                  ]}
                  style={{ minWidth: "320px", flex: "1 1 0%" }}
                >
                  <Select placeholder="Chọn khu vực">
                    {dataProvinces?.map((dt) => (
                      <Option key={dt.province_id} value={dt.province_id}>
                        {dt.name_province}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </SubMenu> */}
          {/* </Menu> */}

          <Form.Item
            style={{ width: "100%", display: "flex", justifyContent: "end" }}
          >
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ModalAddProject refBtnProject={refBtnProject as Ref<HTMLButtonElement>}/>
    </>
  );
}
