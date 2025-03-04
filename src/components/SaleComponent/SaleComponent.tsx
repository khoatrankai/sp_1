"use client";
import React from "react";
import { RiDashboard3Fill } from "react-icons/ri";
import { Dropdown, Space, Select, Tabs } from "antd";
import { IoIosDocument, IoMdArrowDropdown, IoMdTime } from "react-icons/io";
import dynamic from "next/dynamic";
import "./styles.scss";
const GaugeChart = dynamic(() => import("./GaugeChart/GaugeChart"));
const GaugeChart2 = dynamic(() => import("./GaugeChart/GaugeChart-2"));
import TableRevenue from "./TableRevenue";
import ColumnChart from "./ColumnChart";
import PieChart from "./PieChart/PieChart";
import TableTarget from "./TableTarget";
import { FaStar } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import OpporturnityTab from "./OpporturnityTab/OpporturnityTab";
// type Props = {};

type DataType = {
  name: string;
  y: number;
}[];

const SaleComponent = () => {
  const datas: DataType = [
    { name: "Cơ hội(dự kiến)", y: 20000000 },
    { name: "Hợp đồng đến hạn", y: 30000000 },
    { name: "Hợp đồng đã tạo", y: 25000000 },
    { name: "Đề xuất đã tạo", y: 40000000 },
    { name: "Báo giá đã tạo", y: 50000000 },
    { name: "Hóa đơn đến hạn", y: 50000000 },
    { name: "Hợp đơn chưa thanh toán", y: 50000000 },
    { name: "Hóa đơn đã thanh toán", y: 50000000 },
  ];
  const dataCustomer: DataType = [
    { name: "MỚI - chưa liên lạc", y: 2 },
    { name: "1  Đang liên hệ", y: 3 },
    { name: "2 - ẤM - Tiềm năng", y: 10 },
    { name: "3. LẠNH - Chưa quan tâm", y: 3 },
    { name: "KHÁCH HÀNG", y: 29 },
    { name: "LƯU TRỮ", y: 0 },
  ];
  const dataActivate: DataType = [
    { name: "Ghi chú đã tạo", y: 0 },
    { name: "Nhắc nhở đã tạo", y: 100 },
    { name: "Cuộc hẹn đã tạo", y: 0 },
  ];
  const dataDashboard = [
    {
      name: "Cơ hội đáng chú ý",
      icon: FaStar,
      count: 6,
      children: OpporturnityTab,
    },
    { name: "Nhắc nhở", icon: IoMdTime, count: 4, children: OpporturnityTab },
    {
      name: "Hóa đơn đến hạn",
      icon: IoDocumentTextOutline,
      count: 4,
      children: OpporturnityTab,
    },
    {
      name: "Hợp đồng đã tạo",
      icon: IoIosDocument,
      count: 0,
      children: OpporturnityTab,
    },
  ];
  const items = [
    {
      label: <a href="https://www.antgroup.com">Đội ngũ bán hàng</a>,
      key: "0",
    },
    {
      label: <a href="https://www.aliyun.com">Tình hình tài chính</a>,
      key: "1",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];

  return (
    <div className="px-[25px] py-5  flex flex-col gap-y-[42px]">
      <div className="min-h-[66px] border-[1px] rounded-sm bg-white flex lg:items-center gap-4 lg:gap-7 px-[15px] flex-col lg:flex-row py-[15px]">
        <div className="flex flex-1">
          <RiDashboard3Fill className="w-[18px] h-[18px]" />
          <p className="text-lg leading-5 font-normal">Đội ngũ bán hàng</p>
          <Dropdown
            className="ok"
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <a>
              <Space>
                <IoMdArrowDropdown />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Select
          className="min-w-56 flex-1 lg:flex-none lg:basis-1/5 h-9"
          mode="multiple"
          placeholder="Inserted are removed"
          style={{
            width: "100%",
          }}
          options={[{ value: 1, label: "" }]}
        />
        <Select
          className="min-w-56 flex-1 h-9 lg:flex-none lg:basis-1/4"
          mode="multiple"
          placeholder="Inserted are removed"
          style={{
            width: "100%",
          }}
          options={[{ value: 1, label: "" }]}
        />
        <Select
          className="min-w-56 flex-1 h-9 lg:flex-none lg:basis-1/4"
          mode="multiple"
          placeholder="Inserted are removed"
          style={{
            width: "100%",
          }}
          options={[{ value: 1, label: "" }]}
        />
      </div>
      <div className="flex gap-x-[30px] gap-y-[15px] flex-wrap">
        <div className="flex-1 h-[322px] sm:min-w-[322px] rounded-sm bg-white p-[10px]">
          <GaugeChart2 />
        </div>
        <div className="flex-1 h-[322px] sm:min-w-[322px] rounded-sm bg-white p-[10px]">
          <GaugeChart
            title='<span class="slim-dashboard-title">Khách hàng của tôi</span>'
            subtitle={`Thiết lập mục tiêu khách hàng mới <a style="color: blue" href="https://crm.slimsoft.vn/demo/admin/goals" target="_blank">(Tại đây)</a>`}
            plotBands={[
              {
                from: 0,
                to: 9,
                color: "#DF5353",
              },
              {
                from: 9,
                to: 18,
                color: "#DDDF0D",
              },
              {
                from: 18,
                to: 30,
                color: "#55BF3B",
              },
            ]}
            dataSrc={15}
            max={30}
            min={0}
            thinkness={10}
            tickPositions={[0, 5, 10, 15, 20, 25, 30]}
          />
        </div>
        <div className="flex-1 h-[322px] sm:min-w-[322px] rounded-sm bg-white p-[10px]">
          <div className="flex justify-between mb-3">
            <h3 className="text-base font-semibold">Doanh thu của nhân viên</h3>
            <a className="text-xs text-blue-400" href="">
              Xem tất cả
            </a>
          </div>
          <div className="max-h-full overflow-y-scroll">
            <TableRevenue />
          </div>
        </div>
      </div>
      <div className="flex gap-x-[30px] gap-y-[15px] flex-wrap">
        <div className="bg-white min-h-[422px] flex-1 p-5">
          <ColumnChart
            titleSrc={
              '<p class="slim-dashboard-title">Dự báo doanh thu <span class="small"  style="font-size:11.2px">142,000,000</span></p>'
            }
            dataSrc={datas}
            subTitleSrc={`Nguồn doanh thu tương lai từ 
        <u><a style="color: blue" href="https://crm.slimsoft.vn/demo/admin/invoices?sd_id=3" target="_blank" id="sd_invoices">hóa đơn</a></u>, 
        <u><a style="color: blue" href="https://crm.slimsoft.vn/demo/admin/proposals?sd_id=3" target="_blank" id="sd_proposals">đề xuất</a></u>, 
        <u><a style="color: blue" href="https://crm.slimsoft.vn/demo/admin/estimates?sd_id=3" target="_blank" id="sd_estimates">báo giá</a></u> và 
        <u><a style="color: blue" href="https://crm.slimsoft.vn/demo/admin/leads?sd_id=3" target="_blank" id="sd_leads">cơ hội</a></u> trong khung thời gian lựa chọn<br>
        <span class="small" style="font-size:8.4px">Tổng giá trị: 10,642,981,020</span>`}
          />
        </div>
        <div className="bg-white min-h-[422px] flex-1 p-5">
          <ColumnChart
            titleSrc={'<p class="slim-dashboard-title">Đường ống bán hàng</p>'}
            dataSrc={dataCustomer}
            subTitleSrc={`Thống kê <i>số lượng</i> và <i>giá trị dự kiến</i> các 
                <u><a style="color: blue" href="https://crm.slimsoft.vn/demo/admin/leads?sd_id=" target="_blank" id="sd_leads_pipeline">cơ hội</a></u> 
                của từng giai đoạn bán hàng<br>
                <span class="small" style="font-size:8.4px">Tổng giá trị: 9,838,400,000</span>`}
          />
        </div>
      </div>
      <div className="flex gap-x-[30px] gap-y-[15px] flex-wrap">
        <div className="bg-white min-h-[422px] flex-1 p-5">
          <PieChart
            titleSrc={'<p class="slim-dashboard-title">Hoạt động của tôi</p>'}
            dataSrc={dataActivate}
            subTitleSrc={`Bạn đã nổ lực như thế nào? 
        <u><a style="color: blue" href="https://crm.slimsoft.vn/demo/admin/invoices?sd_id=3" target="_blank" id="sd_invoices">(Xem chi tiết)</a></u>`}
          />
        </div>
        <div className="bg-white min-h-[422px] flex-1 p-5">
          <TableTarget />
        </div>
      </div>
      <div className="flex gap-x-[30px] gap-y-[15px] flex-wrap">
        <div className="bg-white min-h-[422px] flex-1 p-5">
          <Tabs
            defaultActiveKey="4"
            items={dataDashboard.map((dt, id) => {
              return {
                key: String(id),
                label: (
                  <div className="flex items-center gap-4">
                    <dt.icon />
                    <p>
                      {dt.name}
                      <span className=" rounded-full bg-black text-white text-sm p-2 ml-2">
                        {dt.count}
                      </span>{" "}
                    </p>
                  </div>
                ),
                children: <dt.children />,
              };
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default SaleComponent;
