/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/plots";
import { Radio, Select, DatePicker } from "antd";
import { Option } from "antd/es/mentions";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import moment from "moment";
import { CustomerInfo } from "@/models/customerInterface";
import customerService from "@/services/customerService";
import dayjs from "dayjs";
// type Props = {}
function generateWeeks(startDate: number, endDate: number) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const weeks = [];

  // Lặp qua các tuần
  while (start.getTime() <= end.getTime()) {
    // Sử dụng getTime() để so sánh
    const weekStart = new Date(start); // Lưu ngày đầu tuần
    start.setDate(start.getDate() + 6); // Chuyển sang ngày cuối tuần
    weeks.push(
      `${moment(weekStart).clone().isoWeek()}-${moment(weekStart)
        .clone()
        .isoWeekYear()}`
    );
    start.setDate(start.getDate() + 1); // Chuyển sang ngày đầu tuần tiếp theo
  }

  return weeks;
}
function generateDays(startDate: number, endDate: number) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];

  while (start <= end) {
    days.push(new Date(start).toISOString().split("T")[0]); // Định dạng thành "YYYY-MM-DD"
    start.setDate(start.getDate() + 1); // Tăng ngày thêm 1
  }

  return days;
}
function generateMonths(startDate: number, endDate: number) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = [];

  while (start <= end) {
    const year = start.getFullYear();
    const month = String(start.getMonth() + 1).padStart(2, "0"); // Tháng từ 0-11 nên cần +1
    months.push(`${year}-${month}`);
    start.setMonth(start.getMonth() + 1);
  }

  return months;
}
function generateYears(startDate: number, endDate: number) {
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year.toString()); // Chuyển số thành chuỗi nếu cần
  }
  return years;
}
const { RangePicker } = DatePicker;
export default function ChartColumn() {
  const [dataType, setDataType] = useState<{ type: string; value: number }[]>(
    []
  );
  // const data = [
  //   { type: "1-3秒", value: 0.16 },
  //   { type: "4-10秒", value: 0.125 },
  //   { type: "11-30秒", value: 0.24 },
  //   { type: "31-60秒", value: 0.19 },
  //   { type: "1-3分", value: 0.22 },
  //   { type: "3-10分", value: 0.05 },
  //   { type: "10-30分", value: 0.01 },
  //   { type: "30+分32", value: 20 },
  //   { type: "30+分32", value: 20 },
  //   { type: "30+分3132", value: 20 },
  //   { type: "30323232", value: 20 },
  //   { type: "30+分32322", value: 20 },
  //   { type: "30+分323223", value: 20 },
  //   { type: "30+分3232223", value: 20 },
  //   { type: "30+分32322323", value: 20 },
  //   { type: "30+分32322323", value: 20 },
  //   { type: "30+分32322232", value: 20 },
  //   { type: "30+分3232223", value: 20 },
  //   { type: "30+分32322232", value: 20 },
  //   { type: "30+分32322234", value: 20 },
  //   { type: "30+分32322256", value: 20 },
  // ];
  useEffect(() => {
    console.log(dataType);
  }, [dataType]);
  const DemoColumn = () => {
    const data =
      dataType.length > 0
        ? dataType
        : [
            {
              type:
                typeTime === "day"
                  ? "Ngày"
                  : typeTime === "week"
                  ? "Tuần"
                  : typeTime === "month"
                  ? "Tháng"
                  : "Năm",
              value: 0,
            },
          ];

    const config = {
      data,
      xField: "type",
      yField: "value",
      style: {
        fill: () => {
          // if (type === "10-30分" || type === "30+分") {
          //   return "#22CBCC";
          // }
          return "#2989FF";
        },
      },
      // label: {
      //   text: (originData: any) => {
      //     return typeTime === "day" ? "" : originData.type;
      //   },
      //   offset: 10,
      // },
      legend: false,
    };
    return <Column {...config} />;
  };
  const [typeTime, setTypeTime] = useState<"day" | "week" | "month" | "year">(
    "month"
  );

  const [timeFirst, setTimeFirst] = useState<number>(
    new Date("2024-12-01").getTime()
  );
  const [timeEnd, setTimeEnd] = useState<number>(
    new Date("2024-12-31").getTime()
  );
  const [groupID, setGroupID] = useState<string>();
  const { datas: dataGroups } = useSelector(
    (state: RootState) => state.get_group_customer
  );
  useEffect(() => {
    const fetchData = async () => {
      if (groupID || typeTime || timeEnd || timeFirst) {
        const filter = {
          time_first: timeFirst,
          time_end: timeEnd,
          group: groupID,
        };
        const res = await customerService.getFilterCustomer(filter);
        if (res.statusCode === 200) {
          const dataSource: CustomerInfo[] = res.data;
          if (typeTime === "day") {
            const dataDay = dataSource.reduce((value: any, item) => {
              const dateTime = new Date(item.created_at);
              const typeTime = `${dateTime.getFullYear()}-${
                dateTime.getMonth() + 1
              }-${
                dateTime.getDate() < 10
                  ? `0` + dateTime.getDate()
                  : dateTime.getDate()
              }`;
              if (!value?.[typeTime]) {
                value[typeTime] = 0;
              }
              value[typeTime] = value[typeTime] + 1;
              return value;
            }, {});
            const dataGenerateDay = generateDays(timeFirst ?? 0, timeEnd ?? 0);
            const dataOK = dataGenerateDay.map((dt) => {
              const dataDate = Object.keys(dataDay).find((dtt) => {
                if (new Date(dtt).getTime() === new Date(dt).getTime()) {
                  return dtt;
                }
              });
              return {
                type: "Ngày " + dt,
                value: dataDate ? dataDay[dataDate] : 0,
              };
            });
            setDataType(dataOK);
          }
          if (typeTime === "week") {
            const dataWeek = dataSource.reduce((value: any, item) => {
              const dateTime = moment(item.created_at);
              const typeWeek = `${dateTime.isoWeek()}-${dateTime.year()}`;
              if (!value?.[typeWeek]) {
                value[typeWeek] = 0;
              }
              value[typeWeek] = value[typeWeek] + 1;
              return value;
            }, {});
            const dataGenerateWeek = generateWeeks(
              timeFirst ?? 0,
              timeEnd ?? 0
            );
            const dataOK = dataGenerateWeek.map((dt) => {
              const dataDate = Object.keys(dataWeek).find((dtt) => {
                if (dt === dtt) {
                  return dtt;
                }
              });
              return {
                type: "Tuần " + dt,
                value: dataDate ? dataWeek[dataDate] : 0,
              };
            });
            // console.log(dataWeek, dataGenerateWeek);
            setDataType(dataOK);
          }
          if (typeTime === "month") {
            const dataMonth = dataSource.reduce((value: any, item) => {
              const dateTime = moment(item.created_at);
              const typeMonth = `${dateTime.year()}-${dateTime.month() + 1}`;
              if (!value?.[typeMonth]) {
                value[typeMonth] = 0;
              }
              value[typeMonth] = value[typeMonth] + 1;
              return value;
            }, {});
            const dataGenerateMonth = generateMonths(
              timeFirst ?? 0,
              timeEnd ?? 0
            );
            const dataOK = dataGenerateMonth.map((dt) => {
              const dataDate = Object.keys(dataMonth).find((dtt) => {
                if (new Date(dt).getTime() === new Date(dtt).getTime()) {
                  return dtt;
                }
              });
              const dtTime = new Date(dt);
              return {
                type:
                  "Tháng " +
                  (dtTime.getMonth() + 1) +
                  "-" +
                  dtTime.getFullYear(),
                value: dataDate ? dataMonth[dataDate] : 0,
              };
            });
            // console.log(dataWeek, dataGenerateWeek);
            setDataType(dataOK);
            console.log(dataGenerateMonth, dataMonth);
          }
          if (typeTime === "year") {
            const dataYear = dataSource.reduce((value: any, item) => {
              const dateTime = moment(item.created_at);
              if (!value?.[dateTime.year()]) {
                value[dateTime.year()] = 0;
              }
              value[dateTime.year()] = value[dateTime.year()] + 1;
              return value;
            }, {});
            const dataGenerateYear = generateYears(
              timeFirst ?? 0,
              timeEnd ?? 0
            );
            const dataOK = dataGenerateYear.map((dt) => {
              const dataDate = Object.keys(dataYear).find((dtt) => {
                if (dt.toString() === dtt.toString()) {
                  return dtt;
                }
              });
              return {
                type: "Năm " + dt,
                value: dataDate ? dataYear[dataDate] : 0,
              };
            });
            setDataType(dataOK);
          }
        }
      }
    };
    fetchData();
  }, [typeTime, timeFirst, timeEnd, groupID]);

  return (
    <div className="sm:px-4 py-4 flex flex-col gap-4 max-w-full">
      <div className="p-4 flex justify-between flex-wrap gap-2">
        <div>
          <Radio.Group
            value={typeTime}
            buttonStyle="solid"
            onChange={(e) => {
              setTypeTime(e.target.value);
            }}
          >
            <Radio.Button value="day">Ngày</Radio.Button>
            <Radio.Button value="week">Tuần</Radio.Button>
            <Radio.Button value="month">Tháng</Radio.Button>
            <Radio.Button value="year">Năm</Radio.Button>
          </Radio.Group>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            className="sm:w-auto w-full"
            placeholder="Chọn nhóm"
            showSearch
            onChange={(e) => {
              setGroupID(e);
            }}
            filterOption={(input, option) => {
              const text = Array.isArray(option?.children)
                ? option.children.join("")
                : option?.children ?? "";
              return text.toLowerCase().includes(input.toLowerCase());
            }}
          >
            {dataGroups?.map((dt) => (
              <Option key={dt.group_id} value={dt.group_id}>
                {dt.name_group}
              </Option>
            ))}
          </Select>

          <RangePicker
            className="sm:w-auto w-full"
            picker={typeTime === "day" ? "date" : typeTime}
            value={[dayjs(timeFirst), dayjs(timeEnd)]}
            onChange={(e, values) => {
              if (typeTime === "year") {
                setTimeFirst(new Date(values[0]).getTime());
                setTimeEnd(new Date(`${values[1]}-12-31`).getTime());
              }
              if (typeTime === "month") {
                setTimeFirst(new Date(`${values[0]}-01`).getTime());
                setTimeEnd(
                  new Date(
                    `${moment(
                      new Date(
                        `${e?.[1]?.year()}-${(e?.[1]?.month() ?? 0) + 2}-01`
                      )
                    )
                      .clone()
                      .subtract(1, "days")}`
                  ).getTime()
                );
              }
              if (typeTime === "day") {
                setTimeFirst(new Date(values[0]).getTime());
                setTimeEnd(new Date(values[1]).getTime());
              }
              if (typeTime === "week") {
                const weekStart = moment()
                  .year(e?.[0]?.year() ?? 0)
                  .isoWeek(
                    Number(
                      values[0]
                        .replace(`${e?.[0]?.year()}-`, "")
                        .replace(/\D/g, "")
                    )
                  )
                  .startOf("isoWeek")
                  .clone()
                  .format("YYYY-MM-DD");

                const weekEnd = moment()
                  .year(e?.[1]?.year() ?? 0)
                  .isoWeek(
                    Number(
                      values[1]
                        .replace(`${e?.[1]?.year()}-`, "")
                        .replace(/\D/g, "")
                    )
                  )
                  .startOf("isoWeek")
                  .clone()
                  .add(5, "days")
                  .format("YYYY-MM-DD");

                setTimeFirst(weekStart ? new Date(weekStart).getTime() : 0);
                setTimeEnd(weekEnd ? new Date(weekEnd).getTime() : 0);
              }
            }}
            // value={}
          />
        </div>
      </div>
      <p className="p-4 text-xl font-semibold">Thống kê khách hàng mới</p>
      <div className="w-full">
        <DemoColumn />
      </div>
    </div>
  );
}
