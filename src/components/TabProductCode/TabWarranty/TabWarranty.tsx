/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Badge,
  Typography,
  Space,
  Row,
  Col,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useParams } from "next/navigation";
import { GetWarranty } from "@/models/productInterface";
import productService from "@/services/productService";
// import { MdOutlineReviews } from "react-icons/md";

const { Title, Text, Paragraph } = Typography;

const getStatusTag = (status: string) => {
  const statusMap: Record<string, { color: string; label: string; badge: any }> = {
    pending: { color: "gold", label: "Chờ xử lý", badge: "warning" },
    in_progress: { color: "blue", label: "Đang xử lý", badge: "processing" },
    completed: { color: "green", label: "Hoàn thành", badge: "success" },
    cancelled: { color: "red", label: "Đã hủy", badge: "error" },
  };

  return statusMap[status] || { color: "default", label: "Không rõ", badge: "default" };
};

const formatDateTime = (date: Date | string | null | undefined) => {
  if (!date) return "Không xác định";
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  if (isNaN(parsedDate.getTime())) return "Không xác định";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
};

export default function TabWarranty() {
  const { id } = useParams();
  const [warranties, setWarranties] = useState<GetWarranty[]>([]);

  const fetchData = async () => {
    const res = await productService.getWarrantiesByCode(id as string);
    if (res.statusCode === 200) {
      setWarranties(res.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Title level={2}>Thông tin bảo hành</Title>
        <Text type="secondary">Lịch sử và tiến trình bảo hành tài sản</Text>

        <Space direction="vertical" size="large" style={{ width: "100%", marginTop: "24px" }}>
          {warranties.map((item) => {
            const status = getStatusTag(item.status);
            return (
              <Card key={item.id} hoverable style={{ width: "100%" }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Space style={{ justifyContent: "space-between", width: "100%" }}>
                    <Text strong>ID: {item.id}</Text>
                    <Badge status={status.badge} text={status.label} />
                  </Space>

                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <CalendarOutlined /> Ngày bắt đầu:{" "}
                      <Text>{formatDateTime(item.date_start)}</Text>
                    </Col>
                    <Col span={12}>
                      <ClockCircleOutlined /> Ngày kết thúc:{" "}
                      <Text>{formatDateTime(item.date_end)}</Text>
                    </Col>
                  </Row>

                  {item.reason && (
                    <Paragraph>
                      <FileTextOutlined /> <strong>Lý do:</strong> {item.reason}
                    </Paragraph>
                  )}

                  {item.solve && (
                    <Paragraph>
                      <CheckCircleOutlined /> <strong>Hướng xử lý:</strong> {item.solve}
                    </Paragraph>
                  )}
                  {item.review && (
                    <Paragraph>
                      <CheckCircleOutlined /> <strong>Đánh giá:</strong> {item.review}
                    </Paragraph>
                  )}


                  {item.note && (
                    <Paragraph>
                      <ExclamationCircleOutlined /> <strong>Ghi chú:</strong> {item.note}
                    </Paragraph>
                  )}
                </Space>
              </Card>
            );
          })}

          {warranties.length === 0 && (
            <Card>
              <Empty
                description={
                  <Space direction="vertical">
                    <Text>Không có bảo hành nào</Text>
                    <Text type="secondary">Chưa có dữ liệu bảo hành cho tài sản này.</Text>
                  </Space>
                }
              />
            </Card>
          )}
        </Space>
      </div>
    </div>
  );
}
