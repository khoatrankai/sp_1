/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/redux/store/store";
import { Scheduler, SchedulerData } from "@bitnoi.se/react-scheduler";
import "@bitnoi.se/react-scheduler/dist/style.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import enDayjsTranslations from "dayjs/locale/en";
import viDayjsTranslations from "dayjs/locale/vi";
dayjs.extend(isBetween);
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ModalUpdateWork from "@/components/Work/Tool/Modal/ModalUpdateWork/ModalUpdateWork";

export default function Component() {
  const refBtn = useRef<HTMLButtonElement>();
  const [IdActivity, setIdActivity] = useState<string>("");
  const { datas: dataActivity } = useSelector(
    (state: RootState) => state.get_activities
  );
  const { datas: dataContract } = useSelector(
    (state: RootState) => state.get_contracts
  );
  const [filterButtonState, setFilterButtonState] = useState(0);
  const [mockedSchedulerData, setMockedSchedulerData] = useState<SchedulerData>(
    []
  );
  const langs: any[] = [
    {
      id: "en",
      lang: {
        feelingEmpty: "I feel so empty...",
        free: "Free",
        loadNext: "Next",
        loadPrevious: "Previous",
        over: "over",
        taken: "Taken",
        topbar: {
          filters: "Filters",
          next: "next",
          prev: "prev",
          today: "Today",
          view: "View",
        },
        search: "search",
        week: "week",
      },
      translateCode: "en-EN",
      dayjsTranslations: enDayjsTranslations,
    },
    {
      id: "vi",
      lang: {
        feelingEmpty: "Tôi cảm thấy trống rỗng...",
        free: "Miễn phí",
        loadNext: "Tiếp theo",
        loadPrevious: "Trước",
        over: "hết",
        taken: "Đã lấy",
        topbar: {
          filters: "Bộ lọc",
          next: "Tiếp theo",
          prev: "Trước",
          today: "Hôm nay",
          view: "Xem",
        },
        search: "Tìm kiếm",
        week: "Tuần",
      },
      translateCode: "vi-VN",
      dayjsTranslations: viDayjsTranslations,
    },
  ];
  useEffect(() => {
    if (IdActivity !== "") {
      refBtn.current?.click();
    }
  }, [IdActivity]);
  useEffect(() => {
    if (dataActivity && dataContract.length) {
      setMockedSchedulerData(
        dataContract.map((dt) => {
          return {
            id: dt.contract_id,
            label: {
              subtitle: dt.description || "",
              title: dt.name_contract || "",
              icon: "",
            },
            data: dataActivity
              .filter((dtt) => dtt.contract?.contract_id === dt.contract_id)
              .map((dtt) => {
                console.log(
                  dtt.name,
                  Math.floor(
                    (Date.now() - new Date(dtt.time_start).getTime()) / 100000
                  )
                );
                return {
                  id: dtt.activity_id,
                  startDate: new Date(dtt.time_start),
                  endDate: new Date(dtt.time_end),
                  occupancy: 0,
                  title: dtt.name || "Untitled",
                  subtitle: dtt.status?.name || "No status",
                  description: dtt.description || "",
                  bgColor:
                    dtt.status?.name_tag === "process_check"
                      ? "rgb(255,193,7)"
                      : dtt.status?.name_tag === "process"
                      ? "rgb(0,123,255)"
                      : dtt.status?.name_tag === "process_waiting"
                      ? "rgb(100,149,237)"
                      : dtt.status?.name_tag === "completed"
                      ? "rgb(40,167,69)"
                      : "rgb(211,211,211)",
                };
              }),
          };
        }) as SchedulerData
      );
    }
  }, [dataActivity, dataContract]);
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleRangeChange = useCallback((range: any) => {
    setRange(range);
  }, []);

  const filteredMockedSchedulerData = mockedSchedulerData.map((person) => ({
    ...person,
    data: person.data.filter(
      (project) =>
        // we use "dayjs" for date calculations, but feel free to use library of your choice
        dayjs(project.startDate).isBetween(range.startDate, range.endDate) ||
        dayjs(project.endDate).isBetween(range.startDate, range.endDate) ||
        (dayjs(project.startDate).isBefore(range.startDate, "day") &&
          dayjs(project.endDate).isAfter(range.endDate, "day"))
    ),
  }));

  return (
    <section>
      <Scheduler
        data={filteredMockedSchedulerData}
        isLoading={false}
        onRangeChange={handleRangeChange}
        onTileClick={(clickedResource) => {
          if (clickedResource) {
            setIdActivity(clickedResource.id);
          }
        }}
        onItemClick={(item) => {
          if (item) {
            window.location.href = `/admin/activity/scheduler/gantt/${item.id}`;
          }
        }}
        onFilterData={() => {
          setFilterButtonState(1);
        }}
        onClearFilterData={() => {
          setFilterButtonState(0);
        }}
        config={{
          zoom: 0,
          filterButtonState,
          showTooltip: false,
          lang: "vi",
          translations: langs,
          showThemeToggle: true,
          defaultTheme: "dark",
        }}
      />
      <ModalUpdateWork
        ID={IdActivity}
        refBtn={refBtn as React.Ref<HTMLButtonElement>}
        type="gantt"
        setID={setIdActivity}
      />
    </section>
  );
}

// const mockedSchedulerData: SchedulerData = [
//   {
//     id: "070ac5b5-8369-4cd2-8ba2-0a209130cc60",
//     label: {
//       icon: "https://picsum.photos/24",
//       title: "Joe Doe",
//       subtitle: "Frontend Developer",
//     },
//     data: [
//       {
//         id: "8b71a8a5-33dd-4fc8-9caa-b4a584ba3762",
//         startDate: new Date("2024-08-13T15:31:24.272Z"),
//         endDate: new Date("2024-08-28T10:28:22.649Z"),
//         occupancy: 3600,
//         title: "Project A",
//         subtitle: "Subtitle A",
//         description: "array indexing Salad West Account",
//         bgColor: "rgb(254,165,177)",
//       },
//       {
//         id: "22fbe237-6344-4c8e-affb-64a1750f33bd",
//         startDate: new Date("2023-10-07T08:16:31.123Z"),
//         endDate: new Date("2023-11-15T21:55:23.582Z"),
//         occupancy: 2852,
//         title: "Project B",
//         subtitle: "Subtitle B",
//         description: "Tuna Home pascal IP drive",
//         bgColor: "rgb(254,165,177)",
//       },
//       {
//         id: "3601c1cd-f4b5-46bc-8564-8c983919e3f5",
//         startDate: new Date("2023-03-30T22:25:14.377Z"),
//         endDate: new Date("2023-09-01T07:20:50.526Z"),
//         occupancy: 1800,
//         title: "Project C",
//         subtitle: "Subtitle C",
//         bgColor: "rgb(254,165,177)",
//       },
//       {
//         id: "b088e4ac-9911-426f-aef3-843d75e714c2",
//         startDate: new Date("2023-10-28T10:08:22.986Z"),
//         endDate: new Date("2023-10-30T12:30:30.150Z"),
//         occupancy: 11111,
//         title: "Project D",
//         subtitle: "Subtitle D",
//         description: "Garden heavy an software Metal",
//         bgColor: "rgb(254,165,177)",
//       },
//     ],
//   },
// ];
