import { Timeline } from "antd";
import React, { useEffect, useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { TimeLineItemProps } from "antd/es/timeline/TimelineItem";
import { IGetHistoryCodeProduct } from "@/models/productInterface";
import productService from "@/services/productService";
import { useParams } from "next/navigation";

export default function TabHistory() {
  const { id } = useParams();
  const [dataHistoryCode, setDataHistoryCode] =
    useState<IGetHistoryCodeProduct[]>();
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
    const res = await productService.findAllHistoryByCode(id as string);
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
        dataHistoryCode.map((dt) => {
          if (dt.status === "selled") {
            return {
              children: `Đã bàn giao cho bên khách hàng vào lúc ${new Date(
                dt.created_at
              ).toLocaleDateString("vi-VN")}`,
              dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
              color: "green",
            };
          }
          if (dt.status === "export") {
            return {
              children: `Đang vận chuyển vào lúc ${new Date(
                dt.created_at
              ).toLocaleDateString("vi-VN")}`,
              color: "blue",
            };
          }
          if (dt.status === "inventory") {
            return {
              children: `Đã lưu vào kho lúc ${new Date(
                dt.created_at
              ).toLocaleDateString("vi-VN")}`,
              color: "gray",
            };
          }
          if (dt.status === "borrowed") {
            return {
              children: `Đã bàn giao cho khách thuê vào lúc ${new Date(
                dt.created_at
              ).toLocaleDateString("vi-VN")}`,
              color: "blue",
            };
          }
          if (dt.status === "maintenance") {
            return {
              children: `Đang bảo trì vào lúc ${new Date(
                dt.created_at
              ).toLocaleDateString("vi-VN")}`,
              color: "yellow",
            };
          }
          if (dt.status === "warranty") {
            return {
              children: `Đã bảo hành vào lúc ${new Date(
                dt.created_at
              ).toLocaleDateString("vi-VN")}`,
              color: "yellow",
            };
          }
          return {};
        })
      );
    }
  }, [dataHistoryCode]);
  return (
    <div>
      <p className="font-semibold">Lịch sử</p>
      <Timeline mode="alternate" items={dataHistory} />
    </div>
  );
}
