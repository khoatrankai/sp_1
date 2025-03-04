/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/plots";
import { Radio, DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import opportunityService from "@/services/opportunityService.";
import { IGetOpportunitiesDto } from "@/models/opportunityInterface";
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
  useEffect(() => {
    const fetchData = async () => {
      if (typeTime || timeEnd || timeFirst) {
        const filter = {
          time_first: timeFirst,
          time_end: timeEnd,
        };
        const res = await opportunityService.getFilterOpportunity(filter);
        if (res.statusCode === 200) {
          const dataSource: IGetOpportunitiesDto[] = res.data;
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
            console.log(dataDay);
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
  }, [typeTime, timeFirst, timeEnd]);

  return (
    <div className="p-4 flex flex-col gap-4 max-w-full border-b-[1px]">
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
          <RangePicker
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
           
          />
        </div>
      </div>
      <p className="p-4 text-xl font-semibold">Thống kê khách hàng</p>
      <div className="w-full">
        <DemoColumn />
      </div>
    </div>
  );
}
