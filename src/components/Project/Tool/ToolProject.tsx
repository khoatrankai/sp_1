import { Button, Tag } from "antd";
import React from "react";
import ModalAddProject from "./Modal/ModalAddProject";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import ModalTypeProject from "./Modal/ModalTypeProject/ModalTypeProject";
import Link from "next/link";
import { FaChartGantt } from "react-icons/fa6";
import { useParams } from "next/navigation";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { GiPieChart } from "react-icons/gi";

export default function ToolProduct() {
  const { customerID } = useParams();
  const { datas: dataAbout } = useSelector(
    (state: RootState) => state.get_project_about
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 flex-wrap">
        <ModalAddProject />
        <ModalTypeProject />
        <Link href={`/admin/project/gantt`}>
          <Button icon={<FaChartGantt />} />
        </Link>
        <Link href={`/detail/project`}>
          <Button icon={<MdOutlineSpaceDashboard />} />
        </Link>
        <Link href={`/management/all_project`}>
          <Button icon={<GiPieChart />} />
        </Link>
      </div>
      {!customerID && (
        <div>
          <h2 className="font-semibold text-[#1BA399]">Tóm lược dự án</h2>
          <div className="flex justify-around gap-2 flex-wrap">
            <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
              <p className="font-bold text-3xl text-white">
                {dataAbout
                  ?.find?.((dt) => dt.status === "waiting")
                  ?.count.toLocaleString("vi-VN") ?? 0}
              </p>
              <p className="text-xs text-wrap text-slate-50/80 min-w-36">
                Chưa bắt đầu
              </p>
            </Tag>
            <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
              <p className="font-bold text-3xl text-white">
                {dataAbout
                  ?.find?.((dt) => dt.status === "start")
                  ?.count.toLocaleString("vi-VN") ?? 0}
              </p>
              <p className="text-xs text-wrap text-slate-50/80 min-w-36">
                Đang thực hiện
              </p>
            </Tag>
            <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
              <p className="font-bold text-3xl text-white">
                {dataAbout
                  ?.find?.((dt) => dt.status === "pause")
                  ?.count.toLocaleString("vi-VN") ?? 0}
              </p>
              <p className="text-xs text-wrap text-slate-50/80 min-w-36">
                Tạm ngưng
              </p>
            </Tag>
            <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
              <p className="font-bold text-3xl text-white">
                {dataAbout
                  ?.find?.((dt) => dt.status === "cancel")
                  ?.count.toLocaleString("vi-VN") ?? 0}
              </p>
              <p className="text-xs text-wrap text-slate-50/80 min-w-36">
                Đã hủy
              </p>
            </Tag>
            <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
              <p className="font-bold text-3xl text-white">
                {dataAbout
                  ?.find?.((dt) => dt.status === "completed")
                  ?.count.toLocaleString("vi-VN") ?? 0}
              </p>
              <p className="text-xs text-wrap text-slate-50/80 min-w-36">
                Hoàn thành
              </p>
            </Tag>
          </div>
        </div>
      )}
    </div>
  );
}
