/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Timeline } from "antd";
import React, { useEffect, useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { TimeLineItemProps } from "antd/es/timeline/TimelineItem";
import { GetHistoryAsset } from "@/models/productInterface";
import productService from "@/services/productService";


type Props = {
  id:string
  handleCancel:any
}
export default function HistoryAsset({id,handleCancel}:Props) {
  const [dataHistoryCode, setDataHistoryCode] =
    useState<GetHistoryAsset[]>();
  const [dataHistory, setDataHistory] = useState<TimeLineItemProps[]>([
    {
      children: "Create a services site 2015-09-01",
    },
    {
      children: "Solve initial network problems 2015-09-01",
      color: "green",
    },
    {
      dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
      children: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    },
    {
      color: "red",
      children: "Network problems being solved 2015-09-01",
    },
    {
      children: "Create a services site 2015-09-01",
    },
    {
      dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
      children: "Technical testing 2015-09-01",
    },
  ]);
 
  const fetchData = async () => {
    const res = await productService.findAllHistoryAssetByID(id as string);
    if (res.statusCode === 200) {
      setDataHistoryCode(res.data);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);
  useEffect(() => {
    if (dataHistoryCode) {
      setDataHistory(
        dataHistoryCode.map((dt,index) => {
          // if (dt.status === "selled") {
          if(index === 0){
             return {
              children: `${dt.description} vào lúc ${new Date(
                dt.created_at
              ).toLocaleDateString("vi-VN")}`,
              dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
              color: "red",
            };
          }
            return {
              children: `${dt.description} vào lúc ${new Date(
                dt.created_at
              ).toLocaleDateString("vi-VN")}`,
              dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
              color: "blue",
            };
          // }
          // return {}
        })
      );
    }
  }, [dataHistoryCode]);
  return (
    <>
      <Modal
              title={
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <span>Lịch sử tài sản</span>
                </div>
              }
              open={id ?true:false}
              onCancel={handleCancel}
              footer={null}
              width={"100%"}
              style={{ maxWidth: "800px" }}
            >
              <div>
                <Timeline mode="alternate" items={dataHistory} />
              </div>
            </Modal>
    
    </>
    
  );
}
