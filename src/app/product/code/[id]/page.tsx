/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Carousel, Image, Tabs, TabsProps } from "antd";
import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import { useParams } from "next/navigation";
import { IGetCodeProduct } from "@/models/productInterface";
import productService from "@/services/productService";
import { CarouselRef } from "antd/es/carousel";
import TabDetail from "@/components/TabProductCode/TabDetail/TabDetail";
import TabSupport from "@/components/TabProductCode/TabSupport/TabSupport";
import TabHistory from "@/components/TabProductCode/TabHistory/TabHistory";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { fetchUserProfile } from "@/redux/store/slices/userSlices/get_profile.slice";
export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const [dataProductCode, setDataProductCode] = useState<IGetCodeProduct>();
  const { id } = useParams();
  const tabs: TabsProps["items"] = [
    {
      label: "Thông số kỹ thuật",
      key: "detail",
      children: (
        <TabDetail dataDetail={dataProductCode?.product.details ?? []} />
      ),
    },
    {
      label: "Bình luận & Hỗ trợ",
      key: "support",
      children: <TabSupport code_product={dataProductCode?.code_product_id} />,
    },
    {
      label: "Lịch sử sản phẩm",
      key: "history",
      children: <TabHistory />,
    },
  ];
  const carouselRef = useRef<CarouselRef | null>(null);
  const handleSetIndex = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.goTo(index);
      setIndexPic(index);
    }
  };
  const [indexPic, setIndexPic] = useState<number>(0);
  const fetchData = async () => {
    const res = await productService.findCodeByID(id as string);
    if (res.statusCode === 200) {
      setDataProductCode(res.data);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  return (
    <div className="p-4">
      <div className="flex gap-8 justify-center flex-wrap">
        <div className="w-96">
          <Carousel
            arrows
            ref={carouselRef}
            autoplay
            className="rounded-md overflow-hidden"
            afterChange={(i) => {
              setIndexPic(i);
            }}
          >
            {dataProductCode?.product?.picture_urls.map((dt) => {
              return (
                <>
                  <Image width={384} height={384} alt="" src={dt.url} />
                </>
              );
            })}
          </Carousel>
          <ul className="flex gap-2 w-full justify-center">
            {dataProductCode?.product?.picture_urls.map((dt, index) => {
              return (
                <>
                  <li
                    className={`p-2 rounded-md flex-1 max-w-fit border-2 transition-all ${
                      indexPic === index
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      width={50}
                      height={50}
                      alt=""
                      src={dt.url}
                      preview={false}
                      onClick={() => {
                        handleSetIndex(index);
                      }}
                    />
                  </li>
                </>
              );
            })}
          </ul>
        </div>
        <div className="p-4 flex flex-col gap-8 max-w-96">
          <p className="text-3xl font-semibold  break-words">
            {dataProductCode?.product.name}
          </p>
          <p className="text font-semibold text-red-500  break-words">
            <span className="text-black">Giá sản phẩm: </span>
            {dataProductCode?.product?.price.toLocaleString("vi-VN")}đ
          </p>
          <div className="rounded-t-md overflow-hidden border-b-[1px]">
            <p className="font-bold p-2 bg-black text-white">
              Thông tin bảo hành
            </p>
            <div className="p-4 max-w-96 w-full flex flex-col gap-1">
              <p className="text-gray-500 break-words">
                <span className="font-bold">Mã bảo hành: </span>
                {dataProductCode?.code_product_id}
              </p>
              <p className="text-gray-500 break-words">
                <span className="font-bold">Ngày bắt đầu: </span>
                {new Date(
                  dataProductCode?.warranty_start ?? ""
                ).toLocaleDateString()}
              </p>
              <p className="text-gray-500 break-words">
                <span className="font-bold">Ngày kết thúc: </span>
                {new Date(
                  dataProductCode?.warranty_end ?? ""
                ).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-gray-500">
                <span className="font-bold">Bảo hành còn lại: </span>
                {dataProductCode?.time_warranty} tháng
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[800px]">
          <Tabs
            className="w-full custom-tabs"
            items={tabs}
            tabPosition={"top"}
            //   onChange={(e) => {
            //     setTabSelect(e);
            //   }}
          />
        </div>
      </div>
    </div>
  );
}
