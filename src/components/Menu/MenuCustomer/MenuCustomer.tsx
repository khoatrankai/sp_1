/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import ModalUpdateContact from "@/components/Customer/Contact/ToolContact/ModalContact/ModalUpdateContact";
import ModalChangePassword from "@/components/Customer/ToolCustomer/ModalCustomer/ModalChangePassword";
import usePostData from "@/hooks/usePostData";
import { fetchCustomerProfile } from "@/redux/store/slices/customerSlices/get_profile.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import customerService from "@/services/roleCustomerService/customerService";
import { Button, Image } from "antd";
import { useRouter } from "next/navigation";
import React, { Ref, useRef } from "react";
import { FaKey, FaRegUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

// type Props = {
//   refBtn?: Ref<HTMLButtonElement>;
// };

export default function MenuCustomer() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { postdata } = usePostData();
  const refBtnProfile = useRef<HTMLButtonElement>();
  const refBtnPassword = useRef<HTMLButtonElement>();
  const { datas: dataProfileCustomer } = useSelector(
    (state: RootState) => state.get_profile_customer
  );
  const handleLogout = async () => {
    const statusCode = await postdata(() => customerService.logoutCustomer());
    if (statusCode === 200) {
      dispatch(fetchCustomerProfile())
        .unwrap()
        .then((dt) => {
          if (dt.statusCode === 400) {
            router.push("/login?type=customer");
          }
        })
        .catch(() => {
          router.push("/login?type=customer");
        });
    }
  };
  return (
    <div className="w-64 h-fit p-2 flex flex-col gap-4 rounded-md shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]">
      <Button
        type="text"
        className="flex w-full h-fit items-center justify-start gap-4  capitalize"
      >
        <Image
          className="rounded-full"
          width={40}
          height={40}
          alt=""
          src={dataProfileCustomer?.picture_url}
        />
        <div className="flex flex-col">
          <p className="font-semibold text-lg">
            {dataProfileCustomer?.full_name}
          </p>
        </div>
      </Button>
      <div className="flex flex-col w-full py-2 border-t-[1px] ">
        <Button
          icon={<FaRegUser />}
          type="text"
          onClick={() => {
            refBtnProfile.current?.click();
          }}
          className="py-4 w-full rounded-md flex items-center justify-start capitalize"
        >
          Hồ sơ
        </Button>
        <Button
          icon={<FaKey />}
          type="text"
          onClick={() => {
            refBtnPassword.current?.click();
          }}
          className="py-4 w-full rounded-md flex items-center justify-start capitalize"
        >
          Đổi mật khẩu
        </Button>
        <Button
          onClick={() => {
            handleLogout();
          }}
          icon={<IoLogOutOutline />}
          type="text"
          className="py-4 w-full  rounded-md flex items-center justify-start capitalize"
        >
          Thoát
        </Button>
      </div>

      <ModalUpdateContact
        type="customer"
        customer_id={dataProfileCustomer?.customer_id as string}
        refBtnCustomer={refBtnProfile as Ref<HTMLButtonElement>}
      />
      <ModalChangePassword
        refBtnUser={refBtnPassword as Ref<HTMLButtonElement>}
      />
    </div>
  );
}
