"use client";
import React from "react";
import "./styles.scss";
import { Button, Image } from "antd";
import { FaUser, FaUserTie } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useMedia from "use-media";

export default function HomePage() {
  const router = useRouter();
  const isMobile = useMedia({ maxWidth: "639px" });
  return (
    <>
      <div
        className={`w-screen  h-screen bg-home flex flex-col justify-center items-center gap-8 p-4`}
      >
        <div className="flex flex-col justify-center items-center">
          <Image
            preview={false}
            alt=""
            src="/logo.png"
            height={isMobile ? 70 : 100}
          />

          <p className="text-white  font-bold sm:text-xl text-center">
            Chào mừng bạn đến với hệ thống quản lý SPARKING
          </p>
          <p className="text-red-500 font-semibold sm:text-sm">
            *Vui lòng chọn chức danh của bạn
          </p>
        </div>

        <div className="flex sm:gap-8 gap-4 flex-wrap justify-center">
          <Button
            onClick={() => {
              router.push("/login?type=customer");
            }}
            icon={<FaUser />}
            type="primary"
            className="sm:text-2xl text-xl sm:w-72 sm:h-24 bg-[#E86B02] font-bold w-56 h-20"
          >
            Khách hàng
          </Button>
          <Button
            onClick={() => {
              router.push("/login?type=admin");
            }}
            icon={<FaUserTie />}
            type="primary"
            className="sm:text-2xl text-xl sm:w-72 sm:h-24 bg-[#02B39A] font-bold w-56 h-20"
          >
            Nhân viên
          </Button>
        </div>
      </div>
    </>
  );
}
