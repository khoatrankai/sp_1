import { STATUS_TAGS_ACTIVITY } from "@/models/activityInterface";
import { fetchYearActivities } from "@/redux/store/slices/activitySlices/activity.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { Badge, Button, Calendar, CalendarProps, Popover, Tag } from "antd";
import { Dayjs } from "dayjs";
import React, { useEffect } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { RiContractFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

// type Props = {}

interface StatusTagProps {
  name_tag: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ name_tag }) => {
  const statusData =
    STATUS_TAGS_ACTIVITY[name_tag as keyof typeof STATUS_TAGS_ACTIVITY];
  return statusData ? statusData.color : "default";
};
export default function SchedulerActivity() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchYearActivities(new Date().getFullYear()));
  }, [dispatch]);
  const { datas: dataActivity } = useSelector(
    (state: RootState) => state.get_activities
  );
  useEffect(() => {
    console.log(dataActivity);
  }, [dataActivity]);
  const getListData = (value: Dayjs) => {
    return dataActivity.filter((dt) => {
      const date = new Date(dt.time_start);
      console.log(
        value,
        date.getDate() === value.date(),
        date.getMonth() === value.month(),
        date.getFullYear() === value.year()
      );
      return (
        date.getDate() === value.date() &&
        date.getMonth() === value.month() &&
        date.getFullYear() === value.year()
      );
    });
  };
  // const monthCellRender = (value: Dayjs) => {
  //   const num = getMonthData(value);
  //   return num ? (
  //     <div className="notes-month">
  //       <section>{num}</section>
  //       <span>Backlog number</span>
  //     </div>
  //   ) : null;
  // };
  const getMonthData = (value: Dayjs) => {
    return dataActivity.filter((dt) => {
      const date = new Date(dt.time_start);
      return (
        date.getMonth() === value.month() + 1 &&
        date.getFullYear() === value.year()
      );
    });
  };
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    console.log(listData);
    return (
      <ul className="flex flex-col gap-2 px-2">
        {listData.map((item) => (
          <>
            <li
              key={item.activity_id}
              className="p-2 rounded-lg  bg-red-100/30 min-w-fit"
            >
              <Popover
                title={"Chi tiết"}
                content={
                  <>
                    <div className="flex flex-col w-80 gap-2">
                      <div className="flex justify-between">
                        <p className="font-semibold capitalize text-xl text-[#00A9AE]">
                          {item.name}
                        </p>
                        <div>
                          <Tag
                            className="text-xs"
                            color={
                              (StatusTag({
                                name_tag: item.status.name_tag,
                              }) as string) ?? "default"
                            }
                          >
                            {item.status.name}
                          </Tag>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center text-black/80 text-sm">
                        <div className="flex items-center">
                          <IoMdInformationCircleOutline className="text-[#00A9AE]" />
                          <p className="font-medium capitalize   ">
                            {item.type.name}
                          </p>
                        </div>
                        {item.contract?.name_contract && (
                          <div className="flex items-center">
                            <RiContractFill className="text-[#00A9AE]" />
                            <p className="font-medium capitalize ">
                              {item.contract?.name_contract}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center">
                          <MdOutlineAccessTimeFilled className="text-[#00A9AE]" />
                          <p className="font-medium capitalize ">
                            {new Date(item.time_start).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-black/60">
                        {item.description}
                      </p>
                      <Button type="default" className="bg-[#ED8C22] ">
                        Xem chi tiết
                      </Button>
                    </div>
                  </>
                }
                className="w-full h-full flex gap-2"
              >
                <div className="bg-red-400 w-2 rounded-full"></div>
                <div className="flex flex-col">
                  <p className="font-semibold capitalize min-w-24">
                    {item.name.length > 20
                      ? `${item.name.slice(0, 20)}...`
                      : item.name}
                  </p>

                  <p className="font-light lowercase text-slate-500 text-sm">
                    {item.type.name}
                  </p>
                </div>
                <div className="flex-1 flex justify-end">
                  <div>
                    <Tag
                      className="text-xs"
                      color={
                        (StatusTag({
                          name_tag: item.status.name_tag,
                        }) as string) ?? "default"
                      }
                    >
                      {item.status.name}
                    </Tag>
                  </div>
                </div>
              </Popover>
            </li>
          </>
        ))}
      </ul>
    );
  };

  const monthCellRender = (value: Dayjs) => {
    const listData = getMonthData(value);
    // const dataStart = listData.filter(
    //   (dt) =>
    //     dt.status.name_tag === "not_started" || dt.status.name_tag === "pending"
    // );
    const dataProcess = listData.filter(
      (dt) =>
        dt.status.name_tag === "in_progress" || dt.status.name_tag === "on_hold"
    );
    const dataCheck = listData.filter(
      (dt) =>
        dt.status.name_tag === "awaiting_review" ||
        dt.status.name_tag === "requires_revision"
    );
    const dataComplete = listData.filter(
      (dt) =>
        dt.status.name_tag === "completed" || dt.status.name_tag === "delivered"
    );
    const dataCancel = listData.filter(
      (dt) =>
        dt.status.name_tag === "canceled" ||
        dt.status.name_tag === "not_feasible"
    );
    // console.log(listData);
    return (
      <div className="p-2 rounded-lg flex flex-col gap-1">
        {listData.length > 0 && (
          <Badge status="default" text={`${listData.length} hoạt động mới`} />
        )}
        {dataProcess.length > 0 && (
          <Badge
            status="processing"
            text={`${dataProcess.length} hoạt động đang thực hiện`}
          />
        )}
        {dataCheck.length > 0 && (
          <Badge
            status="warning"
            text={`${dataCheck.length} hoạt động kiểm tra`}
          />
        )}
        {dataComplete.length > 0 && (
          <Badge
            status="success"
            text={`${dataComplete.length} hoạt động hoàn tất`}
          />
        )}
        {dataCancel.length > 0 && (
          <Badge
            status="error"
            text={`${dataCancel.length} hoạt động hủy bỏ`}
          />
        )}
      </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };
  return (
    <div>
      {/* {dataActivity.length > 0 && ( */}
      <Calendar
        // onSelect={(e) => {
        //   console.log(e);
        // }}
        cellRender={cellRender}
      />
      {/* )} */}
    </div>
  );
}
