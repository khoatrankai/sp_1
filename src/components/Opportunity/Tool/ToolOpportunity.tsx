// import { Select, Tag } from "antd";
import React, { useEffect, useState } from "react";

import ModalTypeOpportunity from "./ModalOpportunity/ModalTypeOpportunity/ModalTypeOpportunity";
import ModalSourceOpportunity from "./ModalOpportunity/ModalSourceOpportunity/ModalSourceOpportunity";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
import ModalAddOpportunity from "./ModalOpportunity/ModalAddOpportunity";
import { DatePicker, Select } from "antd";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchOpportunities } from "@/redux/store/slices/opportunitySlices/get_opportunities.slice";
import { useSearchParams } from "next/navigation";

interface FilterOpportunity {
  type_opportunity?: string;

  type_source?: string;

  user_support?: string;

  status?: string;

  date_start?: string;

  date_end?: string;
}
export default function ToolOpportunity() {
  const searchParams = useSearchParams();
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch<AppDispatch>();

  const [filterData, setFilterData] = useState<FilterOpportunity>({});
  const { datas: dataType } = useSelector(
    (state: RootState) => state.type_opportunity
  );
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.source_opportunity
  );
  const { datas: dataUser } = useSelector(
    (state: RootState) => state.get_users
  );
  const dataStatus = [
    { value: "delete", label: "Đã xóa" },
    { value: "hide", label: "Đã ẩn" },
    { value: "success", label: "Thành công" },
    { value: "pending", label: "Đang tiếp cận" },
    { value: "cancel", label: "Đã hủy" },
    { value: "pause", label: "Đã tạm dừng" },
  ];

  useEffect(() => {
    if (filterData) {
      const status = searchParams.get('status')
      dispatch(fetchOpportunities({...filterData,status:status ?? undefined}));
    }
  }, [filterData,searchParams]);
 
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 flex-wrap">
        <ModalAddOpportunity />
        <ModalTypeOpportunity />
        <ModalSourceOpportunity />
      </div>
      <p className="text-sm font-semibold text-[#1BA399]">Được lọc theo:</p>
      <div className="flex flex-wrap w-full items-center justify-end gap-2   pb-4 ">
        <Select
          placeholder="Loại cơ hội"
          style={{ minWidth: 120, flex: "1 1 0%" }}
          onChange={(e) => {
            setFilterData({ ...filterData, type_opportunity: e });
          }}
          showSearch
          allowClear
          filterOption={(input, option) => {
            return ((option?.label ?? "") as string)
              .toLowerCase()
              .includes(input.toLowerCase());
          }}
          options={dataType.map((dt) => {
            return { value: dt.type_opportunity_id, label: dt.name };
          })}
        />
        <Select
          placeholder="Nguồn cơ hội"
          style={{ minWidth: 120, flex: "1 1 0%" }}
          onChange={(e) => {
            setFilterData({ ...filterData, type_source: e });
          }}
          showSearch
          allowClear
          filterOption={(input, option) => {
            return ((option?.label ?? "") as string)
              .toLowerCase()
              .includes(input.toLowerCase());
          }}
          options={dataSource.map((dt) => {
            return { value: dt.type_source_id, label: dt.name };
          })}
        />
        <Select
          placeholder="Trạng thái"
          style={{ minWidth: 120, flex: "1 1 0%" }}
          onChange={(e) => {
            setFilterData({ ...filterData, status: e });
          }}
          showSearch
          allowClear
          filterOption={(input, option) => {
            return ((option?.label ?? "") as string)
              .toLowerCase()
              .includes(input.toLowerCase());
          }}
          options={dataStatus}
        />

        <Select
          placeholder="Người phụ trách"
          style={{ minWidth: 120, flex: "1 1 0%" }}
          onChange={(e) => {
            setFilterData({ ...filterData, user_support: e });
          }}
          showSearch
          allowClear
          filterOption={(input, option) => {
            return ((option?.label ?? "") as string)
              .toLowerCase()
              .includes(input.toLowerCase());
          }}
          options={dataUser?.map((dt) => {
            return {
              value: dt.user_id,
              label: dt.first_name + " " + dt.last_name,
            };
          })}
        />

        <RangePicker
          style={{ minWidth: 120, flex: "1 1 0%" }}
          onChange={(e, values) => {
            setFilterData({
              ...filterData,
              date_start: values[0],
              date_end: values[1],
            });
          }}
        />
      </div>
    </div>
  );
}
