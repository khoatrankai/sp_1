"use client";
import { toggleMenu } from "@/redux/store/slices/menu.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { Avatar, Badge, Button } from "antd";
import Image from "next/image";
import React from "react";
import { FaBell, FaUser } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import MenuAdmin from "../Menu/MenuAdmin/MenuAdmin";
import Notify from "../Notify/Notify";

// type Props = {};

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataProfile } = useSelector(
    (state: RootState) => state.get_profile
  );
  const { datas: countNotify } = useSelector(
    (state: RootState) => state.get_count_notify
  );
  return (
    <div className="min-h-16 z-50 relative">
      <div className="h-16 bg-white px-4 flex justify-between items-center fixed inset-x-0 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
        <div className="flex items-center gap-2 h-full">
          <IoMenu
            className="h-8 w-8 cursor-pointer"
            onClick={() => {
              dispatch(toggleMenu());
            }}
          />
          <Image
            className="cursor-pointer"
            alt=""
            src={"/logo.png"}
            height={40}
            width={140}
            onClick={() => {
              window.location.href = "/admin";
            }}
          />
        </div>
        {dataProfile ? (
          <div className="flex gap-4">
            <div className="relative group">
              <Badge count={countNotify}>
                <Button
                  type="primary"
                  icon={<FaBell />}
                  className="w-8 h-8 rounded-full"
                />
              </Badge>

              <div className="absolute max-w-96 w-96 h-fit right-0 top-full z-50 bg-white invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                <Notify />
              </div>
            </div>
            <div className="relative group">
              <Avatar
                alt=""
                src={dataProfile.picture_url}
                className="w-8 h-8"
              />
              <div className="absolute w-fit h-fit right-0 top-full z-50 bg-white invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                <MenuAdmin />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-full bg-[#00A9AE] w-fit h-fit p-2">
            <FaUser className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
