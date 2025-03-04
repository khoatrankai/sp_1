import { IGetWork } from "@/models/activityInterface";
import { IGetPayment } from "@/models/contractInterface";
import { IGetProject } from "@/models/projectInterface";
import { RootState } from "@/redux/store/store";
import activityService from "@/services/activityService";
import contractService from "@/services/contractService.";
import projectService from "@/services/projectService";
import { Progress, Tag } from "antd";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { useSelector } from "react-redux";

export default function TabInfo() {
  const { projectID } = useParams();
  const { datas: dataCustomer } = useSelector(
    (state: RootState) => state.infos_customer
  );
  const [works, setWorks] = useState<IGetWork[]>([]);
  const [payments, setPayment] = useState<IGetPayment[]>([]);
  const [workCompleted, setWorkCompleted] = useState<number>(0);
  const [dataProject, setDataProject] = useState<IGetProject>();
  const fetchData = async () => {
    const res = await activityService.getAllWorkByProject(projectID as string);
    const res2 = await projectService.getProject(projectID as string);
    const res3 = await contractService.getPaymentByProject(projectID as string);
    if (
      res.statusCode === 200 &&
      res2.statusCode === 200 &&
      res3.statusCode === 200
    ) {
      setDataProject(res2.data);
      setWorks(res.data ?? []);
      setPayment(res3.data ?? []);
      setWorkCompleted(
        res.data.reduce((preValue: number, currValue: IGetWork) => {
          if (currValue.status.name_tag === "completed") {
            return preValue + 1;
          }
          return preValue;
        }, 0)
      );
    }
  };

  useEffect(() => {
    if (projectID) {
      fetchData();
    }
  }, [projectID]);
  const getDaysBetween = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Chỉ lấy phần ngày/tháng/năm, bỏ qua thời gian
    const startUTC = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    // Tính số ngày
    return Math.ceil(Math.abs(endUTC - startUTC) / (1000 * 60 * 60 * 24));
  };
  return (
    <div className="p-4 flex flex-wrap shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] mt-4 rounded-lg">
      <div className="flex flex-col gap-4 flex-1 min-w-[500px]">
        <div className="flex flex-col gap-4">
          <p className="uppercase font-semibold text-gray-500">Tổng quan</p>
          <div className="flex w-full flex-wrap">
            <div className="flex flex-col sm:flex-1 sm:w-auto w-72">
              <div className="border-t-[1px] flex w-full py-2">
                <p className="flex-1 flex justify-start font-medium">
                  Khách hàng
                </p>
                <a
                  className="flex-1 flex justify-start text-blue-500"
                  href={`/admin/customer/info/${dataProject?.customer}`}
                >
                  {
                    dataCustomer?.find(
                      (dt) => dt.info_id === (dataProject?.customer ?? "")
                    )?.name_company
                  }
                </a>
              </div>
              <div className="border-t-[1px] flex w-full py-2">
                <p className="flex-1 flex justify-start font-medium">
                  Tổng chi phí
                </p>
                <p className="flex-1 flex justify-start">
                  {dataProject?.price?.toLocaleString("vi-vn")}đ
                </p>
              </div>
              <div className="border-t-[1px] flex w-full py-2">
                <p className="flex-1 flex justify-start font-medium">
                  Tình trạng
                </p>
                <p className="flex-1 flex justify-start">
                  {dataProject?.status === "cancel"
                    ? "Đã hủy"
                    : dataProject?.status === "completed"
                    ? "Hoàn thành"
                    : dataProject?.status === "pause"
                    ? "Tạm ngưng"
                    : dataProject?.status === "start"
                    ? "Đang thực hiện"
                    : "Đang chờ"}
                </p>
              </div>
              <div className="border-t-[1px] flex w-full py-2">
                <p className="flex-1 flex justify-start font-medium">
                  Ngày tạo
                </p>
                <p className="flex-1 flex justify-start">
                  {moment(dataProject?.created_at).format("DD/MM/YYYY")}
                </p>
              </div>
              <div className="border-t-[1px] flex w-full py-2">
                <p className="flex-1 flex justify-start font-medium">
                  Ngày bắt đầu
                </p>
                <p className="flex-1 flex justify-start">
                  {" "}
                  {moment(dataProject?.start_date).format("DD/MM/YYYY")}
                </p>
              </div>
              <div className="border-t-[1px] flex w-full py-2">
                <p className="flex-1 flex justify-start font-medium">
                  Hạn hoàn thành
                </p>
                <p className="flex-1 flex justify-start">
                  {" "}
                  {moment(dataProject?.end_date).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 justify-center items-center w-80 h-96 sm:h-full">
              <p className="font-medium">Tiến độ đạt được</p>
              <Progress
                type="circle"
                percent={(workCompleted / works.length) * 100}
                status={
                  dataProject?.status === "completed"
                    ? "success"
                    : dataProject?.status === "cancel"
                    ? "exception"
                    : "normal"
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t-[1px] py-2">
          <p className="uppercase font-semibold text-gray-500">Mô tả</p>
          <p>{dataProject?.description}</p>
        </div>
      </div>
      <div className="flex-1 flex-col flex gap-8">
        <div className="flex gap-4 sm:gap-8 flex-wrap">
          <div className="flex flex-col sm:flex-1 gap-2 sm:w-auto w-80">
            <div className="flex justify-between items-center">
              <p className="uppercase font-semibold">
                {works.length - workCompleted} / {works.length} Công việc chưa
                hoàn thành
              </p>
              <FaCircleCheck />
            </div>
            <p className="font-medium text-gray-500">
              {(workCompleted / works.length) * 100}%
            </p>
            <Progress
              percent={(workCompleted / works.length) * 100}
              showInfo={false}
            />
          </div>
          <div className="flex-col sm:flex-1  gap-2 flex sm:w-auto w-80">
            <div className="flex justify-between items-center">
              <p className="uppercase font-semibold">
                {getDaysBetween(
                  new Date(),
                  dataProject?.end_date ?? new Date()
                )}{" "}
                /{" "}
                {getDaysBetween(
                  dataProject?.start_date ?? new Date(),
                  dataProject?.end_date ?? new Date()
                )}{" "}
                Ngày còn lại
              </p>
              <MdDateRange />
            </div>
            <p className="font-medium text-gray-500">
              {(getDaysBetween(
                new Date(),
                dataProject?.end_date ?? new Date()
              ) /
                (getDaysBetween(
                  dataProject?.start_date ?? new Date(),
                  dataProject?.end_date ?? new Date()
                ) === 0
                  ? 1
                  : getDaysBetween(
                      dataProject?.start_date ?? new Date(),
                      dataProject?.end_date ?? new Date()
                    ))) *
                100}
              %
            </p>
            <Progress
              percent={
                (getDaysBetween(
                  new Date(),
                  dataProject?.end_date ?? new Date()
                ) /
                  (getDaysBetween(
                    dataProject?.start_date ?? new Date(),
                    dataProject?.end_date ?? new Date()
                  ) === 0
                    ? 1
                    : getDaysBetween(
                        dataProject?.start_date ?? new Date(),
                        dataProject?.end_date ?? new Date()
                      ))) *
                100
              }
              showInfo={false}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Tag className="flex flex-col gap-2 flex-1 p-4">
            <p>TỔNG HÓA ĐƠN</p>
            <p className="font-bold">
              {payments
                .reduce((preValue, currValue) => {
                  return preValue + (currValue.price ?? 0);
                }, 0)
                .toLocaleString("vi-vn")}
              đ
            </p>
          </Tag>
          <Tag className="flex flex-col gap-2 flex-1 p-4" color="green">
            <p>ĐÃ THANH TOÁN</p>
            <p className="font-bold">
              {payments
                .reduce((preValue, currValue) => {
                  if (currValue.status === "success") {
                    return preValue + (currValue.price ?? 0);
                  }
                  return preValue;
                }, 0)
                .toLocaleString("vi-vn")}
              đ
            </p>
          </Tag>
          <Tag className="flex flex-col gap-2 flex-1 p-4" color="yellow">
            <p>CHỜ THANH TOÁN</p>
            <p className="font-bold">
              {payments
                .reduce((preValue, currValue) => {
                  const today = new Date();
                  const expired = new Date(currValue.date_expired ?? "");
                  if (
                    currValue.status === "pending" &&
                    today.getTime() <= expired.getTime()
                  ) {
                    return preValue + (currValue.price ?? 0);
                  }
                  return preValue;
                }, 0)
                .toLocaleString("vi-vn")}
              đ
            </p>
          </Tag>
          <Tag className="flex flex-col gap-2 flex-1 p-4" color="red">
            <p>QUÁ HẠN</p>
            <p className="font-bold">
              {payments
                .reduce((preValue, currValue) => {
                  const today = new Date();
                  const expired = new Date(currValue.date_expired ?? "");
                  if (
                    currValue.status === "pending" &&
                    today.getTime() > expired.getTime()
                  ) {
                    return preValue + (currValue.price ?? 0);
                  }
                  return preValue;
                }, 0)
                .toLocaleString("vi-vn")}
              đ
            </p>
          </Tag>
        </div>
      </div>
    </div>
  );
}
