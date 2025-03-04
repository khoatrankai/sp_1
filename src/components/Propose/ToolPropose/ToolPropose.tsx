import { DatePicker, Select } from "antd";
import React from "react";
// import { FaChartPie } from "react-icons/fa";
import ModalPropose from "./ModalPropose/ModalPropose";
import { FilterPropose } from "@/models/proposeInterface";

import { Option } from "antd/es/mentions";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

type Props = {
  setFilterData: React.Dispatch<React.SetStateAction<FilterPropose>>;
  filterData: FilterPropose;
};
type MenuItem = {
  value: string;
  label: string;
};

const { RangePicker } = DatePicker;

export default function ToolPropose({ setFilterData, filterData }: Props) {
  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );
  const itemsFilter: MenuItem[] = [
    { value: "0", label: "Tất cả" },
    { value: "1", label: "Đã hết hạn" },
    { value: "2", label: "Cơ hội" },
    { value: "3", label: "Khách hàng" },
  ];

  const itemsDate: MenuItem[] = [
    { value: "0", label: "Ngày đề xuất" },
    { value: "1", label: "Ngày hết hạn" },
  ];
  const itemsStatus: MenuItem[] = [
    { value: "draff", label: "Draff" },
    { value: "send", label: "Send" },
    { value: "open", label: "Open" },
    { value: "edit", label: "Edit" },
    { value: "refuse", label: "Refuse" },
    { value: "accept", label: "Accept" },
  ];
  return (
    <div className="flex items-start gap-4 w-full flex-col">
      <div className="flex gap-1 flex-wrap">
        {/* <Button
          className="bg-blue-400 border-0 text-white font-semibold"
          icon={<IoAddOutline />}
        >
          Thêm đề xuất
        </Button> */}
        <ModalPropose />
        {/* <Button icon={<FaChartPie />} /> */}
      </div>

      <div className="flex flex-wrap w-full items-center justify-end gap-2   pb-4 ">
        <Select
          defaultValue="0"
          style={{ minWidth: 120, flex: "1 1 0%" }}
          onChange={(e) => {
            setFilterData({ ...filterData, type: e });
          }}
          options={itemsFilter}
        />
        <Select
          placeholder="Ngày"
          style={{ minWidth: 120, flex: "1 1 0%" }}
          onChange={(e) => {
            setFilterData({ ...filterData, type_date: e });
          }}
          options={itemsDate}
        />
        <Select
          placeholder="Tình trạng"
          onChange={(e) => {
            setFilterData({ ...filterData, status: e });
          }}
          style={{ minWidth: 120, flex: "1 1 0%" }}
          options={itemsStatus}
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
        <Select
          placeholder="Người phụ trách"
          showSearch
          filterOption={(input, option) => {
            return (option?.children?.join("") ?? "")
              .toLowerCase()
              .includes(input.toLowerCase());
          }}
          onChange={(e) => {
            setFilterData({ ...filterData, staff_support: e });
          }}
          style={{ minWidth: 120, flex: "1 1 0%" }}
        >
          {dataUsers?.map((dt) => (
            <Option key={dt.user_id} value={dt.user_id}>
              {dt.first_name} {dt.last_name}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
}
