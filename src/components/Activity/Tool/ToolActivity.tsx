import { Button, DatePicker, Select } from "antd";
import React, { useEffect, useState } from "react";
import ModalAddActivity from "./Modal/ModalActivity";
import ModalTypeActivity from "./Modal/ModalTypeActivity/ModalTypeActivity";
import ModalStatusActivity from "./Modal/ModalStatusActivity/ModalStatusActivity";
import Link from "next/link";
import { FaTableCells } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { fetchActivities } from "@/redux/store/slices/activitySlices/activity.slice";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";

// type MenuItem = {
//   value: string;
//   label: string;
// };

// const { RangePicker } = DatePicker;
interface FilterActivity {
  contract?: string;
  type?: string;

  status?: string;
  project?: string;

  date_start?: string;

  date_end?: string;
}
export default function ToolActivity() {
  const { RangePicker } = DatePicker;
  const [filterData, setFilterData] = useState<FilterActivity>({});
  const { projectID } = useParams();
  const { datas: dataTypeActivity } = useSelector(
    (state: RootState) => state.get_type_activities
  );
  const { datas: dataContracts } = useSelector(
    (state: RootState) => state.get_contracts
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (filterData) {
      dispatch(
        fetchActivities({ ...filterData, project: projectID as string })
      );
    }
  }, [filterData]);
  // // const { data: dataUsers } = useFetchData<InfoUser[]>(userService.getUsers);

  // const { datas: dataProjects } = useSelector(
  //   (state: RootState) => state.get_projects
  // );
  // const [itemProject, setItemProject] = useState<MenuItem[]>([]);

  // const itemsDate: MenuItem[] = [
  //   { value: "0", label: "Ngày đề xuất" },
  //   { value: "1", label: "Ngày hết hạn" },
  // ];
  // const itemsStatus: MenuItem[] = [
  //   { value: "draff", label: "Draff" },
  //   { value: "send", label: "Send" },
  //   { value: "open", label: "Open" },
  //   { value: "edit", label: "Edit" },
  //   { value: "refuse", label: "Refuse" },
  //   { value: "accept", label: "Accept" },
  // ];

  // useEffect(() => {
  //   if (dataProjects) {
  //     const customData =
  //       dataProjects.map((dt) => {
  //         return { value: dt.project_id, label: dt.name ?? "" };
  //       }) ?? [];
  //     setItemProject(customData);
  //   }
  // }, [dataProjects]);
  return (
    <div className="flex items-start gap-4 w-full flex-col">
      <div className="flex gap-2 items-center flex-wrap">
        {/* <Button
          className="bg-blue-400 border-0 text-white font-semibold"
          icon={<IoAddOutline />}
        >
          Thêm đề xuất
        </Button> */}
        <ModalAddActivity />
        <div className="sm:block hidden">
          <ModalTypeActivity />
        </div>
        <div className="sm:block hidden">
          <ModalStatusActivity />
        </div>

        {!projectID && (
          <Link href={"/admin/activity/scheduler"}>
            <Button icon={<FaTableCells />} />
          </Link>
        )}

        {/* <Link href={"/admin/activity/scheduler"}>
          <Button icon={<FaChartPie />} />
        </Link> */}
      </div>
      {!projectID && (
        <div>
          <p className="text-sm font-semibold text-[#1BA399]">Được lọc theo:</p>
          <div className="flex flex-wrap w-full items-center justify-end gap-2   pb-4 ">
            <Select
              placeholder="Hợp đồng"
              style={{ minWidth: 120, flex: "1 1 0%" }}
              onChange={(e) => {
                setFilterData({ ...filterData, contract: e });
              }}
              showSearch
              allowClear
              filterOption={(input, option) => {
                return ((option?.label ?? "") as string)
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
              options={dataContracts.map((dt) => {
                return { value: dt.contract_id, label: dt.name_contract };
              })}
            />
            <Select
              placeholder="Loại hoạt động"
              style={{ minWidth: 120, flex: "1 1 0%" }}
              onChange={(e) => {
                setFilterData({ ...filterData, type: e });
              }}
              showSearch
              allowClear
              filterOption={(input, option) => {
                return ((option?.label ?? "") as string)
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
              options={dataTypeActivity.map((dt) => {
                return { value: dt.type_activity_id, label: dt.name };
              })}
            />
            {filterData.type && (
              <Select
                placeholder="Tình trạng"
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
                style={{ minWidth: 120, flex: "1 1 0%" }}
                options={dataTypeActivity
                  .find((dt) => dt.type_activity_id === filterData.type)
                  ?.status?.map((dt) => {
                    return { value: dt.status_activity_id, label: dt.name };
                  })}
              />
            )}

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
      )}

      {/* <div className="flex flex-wrap w-full items-center justify-end gap-2 ">
        <Select
          placeholder="Dự án"
          style={{ minWidth: 120, flex: "1 1 0%" }}
          onChange={(e) => {
            setFilterData({ ...filterData, project: e });
          }}
          options={itemProject}
        />
        <Select
          placeholder="Ngày"
          style={{ minWidth: 120, flex: "1 1 0%" }}
          onChange={(e) => {
            setFilterData({ ...filterData, type_date: e });
          }}
          options={itemsDate}
        />

        <RangePicker
          style={{ minWidth: 120, flex: "1 1 0%" }}
          onChange={(e, values) => {
            console.log("thay doi", values);
            if (values[0] !== "") {
              setFilterData({
                ...filterData,
                date_start: values[0],
                date_expired: values[1],
              });
            } else {
              dispatch(fetchPriceQuotes({}));
            }
          }}
        />
        <Select
          placeholder="Tình trạng"
          onChange={(e) => {
            setFilterData({ ...filterData, status: e });
          }}
          style={{ minWidth: 120, flex: "1 1 0%" }}
          options={itemsStatus}
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
            setFilterData({ ...filterData, user_support: e });
          }}
          style={{ minWidth: 120, flex: "1 1 0%" }}
        >
          {dataUsers?.map((dt) => (
            <Option key={dt.user_id} value={dt.user_id}>
              {dt.first_name} {dt.last_name}
            </Option>
          ))}
        </Select>
      </div> */}
    </div>
  );
}
