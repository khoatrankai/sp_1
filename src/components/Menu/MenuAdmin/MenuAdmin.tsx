/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import ModalChangePassword from "@/components/User/Tool/Modal/ModalChangePassword";
import ModalUpdateUser from "@/components/User/Tool/Modal/ModalUpdateUser/ModalUpdateUser";
import usePostData from "@/hooks/usePostData";
import { fetchUserProfile } from "@/redux/store/slices/userSlices/get_profile.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import userService from "@/services/userService";
import { Button, Image } from "antd";
import { useRouter } from "next/navigation";
import React, { Ref, useRef } from "react";
import { CiSettings } from "react-icons/ci";
import { FaKey, FaRegUser } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

// type Props = {
//   refBtn?: Ref<HTMLButtonElement>;
// };

export default function MenuAdmin() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { postdata } = usePostData();
  const refBtnProfile = useRef<HTMLButtonElement>();
  const refBtnPassword = useRef<HTMLButtonElement>();
  const { datas: dataProfile } = useSelector(
    (state: RootState) => state.get_profile
  );
  const handleLogout = async () => {
    const statusCode = await postdata(() => userService.logoutUser());
    if (statusCode === 200) {
      dispatch(fetchUserProfile())
        .unwrap()
        .then((dt) => {
          if (dt.statusCode === 400) {
            router.push("/login");
          }
        })
        .catch(() => {
          router.push("/login");
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
          src={dataProfile?.picture_url}
        />
        <div className="flex flex-col">
          <p className="font-semibold text-lg">
            {dataProfile?.first_name} {dataProfile?.last_name}
          </p>

          <div className="flex gap-1 items-center">
            <FiUser />

            <p>{dataProfile?.group_user?.name_group}</p>
          </div>
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
          type="text"
          icon={<CiSettings />}
          className="py-4 w-full  rounded-md flex items-center justify-start capitalize"
        >
          Hệ thống
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

      <ModalUpdateUser
        ID={dataProfile?.user_id as string}
        refBtnUser={refBtnProfile as Ref<HTMLButtonElement>}
      />
      <ModalChangePassword
        refBtnUser={refBtnPassword as Ref<HTMLButtonElement>}
      />
    </div>
  );
}
