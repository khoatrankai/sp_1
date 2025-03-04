"use client";
import { onDeleteImagePreview } from "@/redux/store/slices/image-preview.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { Image } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function CustomImage() {
  const { value } = useSelector((state: RootState) => state.image_preview);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <Image
        hidden
        preview={{
          visible: value === "" ? false : true,
          onVisibleChange: () => {
            dispatch(onDeleteImagePreview());
          },
        }}
        alt=""
        src={value}
      />
    </>
  );
}
