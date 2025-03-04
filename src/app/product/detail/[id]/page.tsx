/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button, Carousel, Image, Tabs, TabsProps, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import { useParams } from "next/navigation";
import { IGetProductInfo } from "@/models/productInterface";
import productService from "@/services/productService";
import { CarouselRef } from "antd/es/carousel";
import TabDetail from "@/components/TabProductCode/TabDetail/TabDetail";
import { FaCartArrowDown } from "react-icons/fa";
const { Paragraph } = Typography;
export default function page() {
  const [dataProduct, setDataProduct] = useState<IGetProductInfo>();
  const { id } = useParams();
  const tabs: TabsProps["items"] = [
    {
      label: "Thông số kỹ thuật",
      key: "detail",
      children: <TabDetail dataDetail={dataProduct?.details ?? []} />,
    },
    {
      label: "Mô tả",
      key: "description",
      children: (
        <>
          <Paragraph>{dataProduct?.description}</Paragraph>
        </>
      ),
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
    const res = await productService.getProductID(id as string);
    if (res.statusCode === 200) {
      setDataProduct(res.data);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);
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
            {dataProduct?.picture_urls.map((dt) => {
              return (
                <>
                  <Image width={384} height={384} alt="" src={dt.url} />
                </>
              );
            })}
          </Carousel>
          <ul className="flex gap-2 w-full justify-center">
            {dataProduct?.picture_urls.map((dt, index) => {
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
            {dataProduct?.name}
          </p>
          <p className="text font-semibold text-red-500  break-words">
            <span className="text-black">Giá sản phẩm: </span>
            {dataProduct?.price.toLocaleString("vi-VN")}đ
          </p>
          <div className="flex gap-2 w-full">
            <Button
              title="Mua ngay"
              className="text-2xl font-semibold h-12 flex-1 bg-[#ED8A21]"
              type="primary"
            >
              Mua ngay
            </Button>
            <Button className="min-h-12 min-w-12" icon={<FaCartArrowDown />} />
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
