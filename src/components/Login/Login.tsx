"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
// import Image from "next/image";
import { Button, Form, Image, Input, Modal } from "antd";
import Link from "next/link";
import { useForm } from "antd/es/form/Form";
import usePostData from "@/hooks/usePostData";
import userService from "@/services/userService";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "@/redux/store/slices/userSlices/get_profile.slice";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { FaUserEdit } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import { toast } from "react-toastify";
import { fetchCustomerProfile } from "@/redux/store/slices/customerSlices/get_profile.slice";
import customerService from "@/services/roleCustomerService/customerService";
// type Props = {}

export default function Login() {
  const [form] = useForm();
  const [formSign] = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalSuccess, setIsModalSuccess] = useState<boolean>(false);
  const [tabLogin, setTabLogin] = useState<boolean | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataProfile } = useSelector(
    (state: RootState) => state.get_profile
  );
  const { datas: dataProfileCustomer } = useSelector(
    (state: RootState) => state.get_profile_customer
  );
  const { postdata } = usePostData();
  const handleSubmit = async (values: { email: string; password: string }) => {
    if (tabLogin) {
      const statusCode = await postdata(() =>
        customerService.loginCustomer(values)
      );
      if (statusCode === 200) {
        dispatch(fetchCustomerProfile());
        router.push("/customer");
      }
    } else {
      const statusCode = await postdata(() => userService.loginUser(values));
      if (statusCode === 200) {
        dispatch(fetchUserProfile());
        router.push("/admin");
      }
    }
  };
  const handleSign = async (values: { email: string }) => {
    if (tabLogin) {
    } else {
      const statusCode = await postdata(() => userService.sendSign(values));
      if (statusCode === 201) {
        setIsModalSuccess(true);
        setIsModalVisible(false);
        formSign.resetFields();
      }
    }
  };
  const fetchData = async () => {
    if (searchParams) {
      const type = searchParams.get("type");
      const email = searchParams.get("email");
      const password = searchParams.get("password");
      const status = searchParams.get("status");
      if (status === "success") {
        toast.update("12", {
          render: "Tài khoản đã được xác nhận",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      if (status === "fail") {
        toast.update("12", {
          render: "Tài khoản đã bị lỗi",
          type: "error",
          isLoading: false,
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      if (email && password) {
        await handleSubmit({ email, password });
      } else {
        if (type === "customer") {
          setTabLogin(true);
          if (!dataProfileCustomer) {
            dispatch(fetchCustomerProfile());
          } else {
            router.push("/customer");
          }
        } else {
          setTabLogin(false);
          if (!dataProfile) {
            dispatch(fetchUserProfile());
          } else {
            router.push("/admin");
          }
        }
      }
    } else {
      setTabLogin(false);
      if (!dataProfile) {
        dispatch(fetchUserProfile());
      } else {
        router.push("/admin");
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [searchParams, dataProfile, dispatch, router, dataProfileCustomer]);
  return (
    <div
      className={`w-screen  h-screen bg-login flex justify-center items-center`}
    >
      <div className="px-32 min-w-[605px] absolute xl:relative hidden xl:block flex-col gap-4">
        <Image
          preview={false}
          alt=""
          src="/logo.png"
          className=" h-full "
          height={80}
        />
      </div>
      <div
        className={`xl:border-l-2 flex flex-col sm:px-32 sm:mx-0 mx-2 sm:w-auto items-center w-full xl:gap-16 gap-8 py-16 justify-center xl:bg-transparent bg-white/20 rounded-xl xl:rounded-none xl:z-0 z-10`}
      >
        <div className="flex flex-col items-center gap-2 max-w-60">
          <Image
            preview={false}
            alt=""
            src="/logo.png"
            className=" h-full w-full xl:hidden block"
            height={30}
          />
          <p className="font-medium text-white capitalize text-4xl xl:block hidden">
            Welcome
          </p>
          <p className="xl:uppercase xl:text-base text-white font-medium sm:text-xl text-base capitalize min-w-max">
            Login to {tabLogin ? "Customer" : "Admin"} dashboard
          </p>
        </div>
        <Form
          //   layout="vertical"
          className="max-w-60 w-full"
          form={form}
          onFinish={handleSubmit}
          style={{}}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "string",
                message: "Vui lòng nhập tài khoản",
              },
            ]}
            style={{ minWidth: "100%", flex: "1 1 0%", marginBottom: "6px" }}
          >
            <Input
              placeholder="Tài khoản"
              className="!bg-white/25 !text-white"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                type: "string",
                message: "Vui lòng nhập mật khẩu",
              },
            ]}
            style={{ minWidth: "100%", flex: "1 1 0%", margin: "0px" }}
          >
            <Input.Password
              placeholder="Mật khẩu"
              className="!bg-white/25 !text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  form.submit();
                }
              }}
            />
          </Form.Item>
        </Form>
        <div className="flex flex-col items-center gap-4  max-w-60 w-full">
          <div className="flex gap-1 w-full">
            <Button
              className="uppercase font-medium bg-[#ED8A21]  flex-1"
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              Login
            </Button>
            <Button
              className="uppercase "
              type="primary"
              icon={<FaUserEdit />}
              onClick={() => {
                setIsModalVisible(true);
              }}
            />
          </div>

          <Link
            href={"#"}
            className="uppercase text-white text-sm font-medium underline "
          >
            Forgetten your password?
          </Link>
        </div>
      </div>
      <Modal
        title="Đăng ký"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "320px" }}
      >
        <Form layout="vertical" form={formSign} onFinish={handleSign}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "string",
                message: "Vui lòng nhập email",
              },
            ]}
            style={{ width: "100%" }}
          >
            <Input placeholder="Email của bạn" />
          </Form.Item>
        </Form>
        <div className="flex justify-end w-full mt-4">
          <Button
            type="primary"
            onClick={() => {
              formSign.submit();
            }}
          >
            Đăng ký
          </Button>
        </div>
      </Modal>

      <Modal
        open={isModalSuccess}
        onCancel={() => {
          setIsModalSuccess(false);
        }}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "320px" }}
      >
        <div className="flex justify-center items-center flex-col">
          <div className="p-16 w-fit rounded-full border-2 border-blue-600 mb-2">
            <MdDone className="text-6xl text-green-500" />
          </div>
          <p className="font-semibold text-3xl">Gửi đơn đăng ký thành công</p>
        </div>
      </Modal>
    </div>
  );
}
