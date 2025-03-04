"use client";
import React from "react";
import "./styles.scss";
import { Image } from "antd";
import useMedia from "use-media";
import Link from "next/link";

export default function HomePageCustomer() {
  const isMobile = useMedia({ maxWidth: "639px" });
  return (
    <>
      <div
        className={`w-full  h-screen bg-home flex flex-col justify-center items-center gap-8 p-4`}
      >
        <div className="flex flex-col justify-center items-center">
          <Image
            preview={false}
            alt=""
            src="/logo.png"
            height={isMobile ? 70 : 100}
          />

          <p className="text-white  font-bold sm:text-xl text-center">
            SPARKING, Kính Chào Quý Khách Đến Với Trình Quản Lý
          </p>
        </div>

        <div className="flex sm:gap-8 gap-4 flex-wrap justify-center">
          <Link
            href="mailto:contact@sparking.com.vn"
            className="sm:text-2xl text-xl sm:w-72 sm:h-24 bg-[#02B39A] font-bold w-56 h-20 rounded-md flex justify-center items-center text-white hover:bg-[#ED8A21]"
          >
            Đóng góp ý kiến
          </Link>
        </div>
      </div>
    </>
  );
}
