"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Badge,
  Avatar,
  Typography,
  Space,
  Row,
  Col,
  Image,
  Tag,
  Divider,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { IGetActivity } from "@/models/activityInterface";
import activityService from "@/services/activityService";
import { useParams } from "next/navigation";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

// Cập nhật interfaces

// Cập nhật mock data với nhiều loại hoạt động và trạng thái hơn

// Cập nhật mock activities với dữ liệu đa dạng hơn

// Thêm function để lấy màu sắc dựa trên name_tag
const getTagColor = (nameTag: string) => {
  const tagColors = {
    meeting: "blue",
    event: "purple",
    training: "green",
    project: "red",
    workshop: "orange",
    presentation: "cyan",
    inspection: "magenta",
    maintenance: "lime",
    processing: "green",
    upcoming: "orange",
    completed: "default",
    paused: "red",
    cancelled: "red",
    pending: "gold",
    overdue: "volcano",
  };
  return tagColors[nameTag as keyof typeof tagColors] || "default";
};

const getBadgeStatus = (nameTag: string) => {
  const statusMap = {
    processing: "processing" as const,
    upcoming: "warning" as const,
    completed: "success" as const,
    paused: "error" as const,
    cancelled: "error" as const,
    pending: "warning" as const,
    overdue: "error" as const,
  };
  return statusMap[nameTag as keyof typeof statusMap] || ("default" as const);
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

export default function TabActivity() {
  const { id } = useParams();
  const [activities, setActivities] = useState<IGetActivity[]>([]);

  // const filteredActivities = activities.filter((activity) => {
  //   if (filter === "all") return true;
  //   return activity.status.name.toLowerCase().includes(filter.toLowerCase());
  // });

  // const filterOptions = [
  //   { label: "Tất cả", value: "all" },
  //   { label: "Đang diễn ra", value: "đang diễn ra" },
  //   { label: "Sắp diễn ra", value: "sắp diễn ra" },
  //   { label: "Hoàn thành", value: "hoàn thành" },
  //   { label: "Tạm hoãn", value: "tạm hoãn" },
  // ];
  const fetchData = async () => {
    const res = await activityService.getActivitiesByCode(id as string);
    if (res.statusCode === 200) {
      setActivities(res.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: "16px" }}
          >
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                Hoạt động
              </Title>
            </Col>
          </Row>
          <Text type="secondary">
            Quản lý và theo dõi các hoạt động của bạn
          </Text>
        </div>

        {/* Activities List */}
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {activities.map((activity) => (
            <Card
              key={activity.activity_id}
              hoverable
              style={{ width: "100%" }}
            >
              <Meta
                avatar={
                  <Avatar size={48} style={{ backgroundColor: "#1890ff" }}>
                    {activity.name.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={
                  <Space>
                    <Text strong style={{ fontSize: "16px" }}>
                      {activity.name}
                    </Text>
                    <Badge
                      status={getBadgeStatus(activity.status.name_tag)}
                      text={activity.status.name}
                    />
                    <Tag color={getTagColor(activity.type.name_tag)}>
                      {activity.type.name}
                    </Tag>
                  </Space>
                }
                description={
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Text type="secondary">ID: {activity.activity_id}</Text>
                    {activity.description && (
                      <Paragraph style={{ margin: 0 }}>
                        {activity.description}
                      </Paragraph>
                    )}
                  </Space>
                }
              />

              <Divider />

              {/* Time Information */}
              <Row gutter={[16, 8]} style={{ marginBottom: "16px" }}>
                <Col xs={24} md={12}>
                  <Space>
                    <CalendarOutlined style={{ color: "#1890ff" }} />
                    <Text type="secondary">
                      Bắt đầu:{" "}
                      {formatDateTime(new Date(activity.time_start ?? ""))}
                    </Text>
                  </Space>
                </Col>
                <Col xs={24} md={12}>
                  <Space>
                    <ClockCircleOutlined style={{ color: "#1890ff" }} />
                    <Text type="secondary">
                      Kết thúc:{" "}
                      {formatDateTime(new Date(activity.time_end ?? ""))}
                    </Text>
                  </Space>
                </Col>
              </Row>

              {/* Additional Information */}
              <Row gutter={[16, 8]} style={{ marginBottom: "16px" }}>
                {activity.contract && (
                  <Col xs={24} md={12}>
                    <Space>
                      <UserOutlined style={{ color: "#52c41a" }} />
                      <Text type="secondary">
                        Dự án: {activity.contract.project?.name}
                      </Text>
                    </Space>
                  </Col>
                )}

                <Col xs={24} md={12}>
                  <Text type="secondary">
                    Tạo: {formatDateTime(activity.created_at)}
                  </Text>
                </Col>
              </Row>

              {/* Images */}
              {(activity?.picture_urls ?? [])?.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <Space style={{ marginBottom: "12px" }}>
                      <PictureOutlined style={{ color: "#722ed1" }} />
                      <Text type="secondary">
                        Hình ảnh ({(activity?.picture_urls ?? []).length})
                      </Text>
                    </Space>
                    <Space>
                      {(activity.picture_urls ?? [])
                        .slice(0, 3)
                        .map((picture) => (
                          <Image
                            key={picture.picture_id}
                            width={64}
                            height={64}
                            src={
                              picture.url ||
                              "/placeholder.svg?height=64&width=64"
                            }
                            alt="Activity"
                            style={{ borderRadius: "6px", objectFit: "cover" }}
                          />
                        ))}
                      {(activity.picture_urls ?? []).length > 3 && (
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "6px",
                            border: "1px solid #d9d9d9",
                            backgroundColor: "#fafafa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            +{(activity.picture_urls ?? []).length - 3}
                          </Text>
                        </div>
                      )}
                    </Space>
                  </div>
                </>
              )}
            </Card>
          ))}
        </Space>

        {activities.length === 0 && (
          <Card>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical">
                  <Text>Không có hoạt động nào</Text>
                  <Text type="secondary">
                    Chưa có hoạt động nào phù hợp với bộ lọc hiện tại.
                  </Text>
                </Space>
              }
            />
          </Card>
        )}
      </div>
    </div>
  );
}
