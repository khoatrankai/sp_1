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
import ModalUpdateProject from "../Tool/Modal/ModalUpdateProject";
import "./styles.scss";
import useMedia from "use-media";
export default function Component() {
  const isMobile = useMedia({ maxWidth: 639 });
  const refBtn = useRef<HTMLButtonElement>();
  const [IdProject, setIdProject] = useState<string>("");

  const { datas: dataTypeFull } = useSelector(
    (state: RootState) => state.type_full_projects
  );
  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
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
    if (IdProject !== "") {
      refBtn.current?.click();
    }
  }, [IdProject]);
  useEffect(() => {
    if (dataTypeFull && dataTypeFull.length) {
      setMockedSchedulerData(
        dataTypeFull.map((dt) => {
          return {
            id: dt.type_id,
            label: {
              subtitle: "",
              title: dt.name_type || "",
              icon: "",
            },
            data: dt.projects?.map((dtt) => {
              return {
                id: dtt.project_id,
                startDate: dtt.start_date ? new Date(dtt.start_date) : 0,
                endDate: dtt.end_date ? new Date(dtt.end_date) : 0,
                occupancy: 0,
                title: dtt.name || "Untitled",
                subtitle: dtt.status,
                description: dtt.description || "",
                bgColor:
                  dtt.status === "pause"
                    ? "rgb(255,193,7)"
                    : dtt.status === "start"
                    ? "rgb(0,123,255)"
                    : dtt.status === "waiting"
                    ? "rgb(100,149,237)"
                    : dtt.status === "completed"
                    ? "rgb(40,167,69)"
                    : "rgb(211,211,211)",
              };
            }),
          };
        }) as SchedulerData
      );
    }
  }, [dataTypeFull, dataUsers]);
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
    <section className={`${isMobile ? "unactive" : ""}`}>
      <Scheduler
        data={filteredMockedSchedulerData}
        isLoading={false}
        onRangeChange={handleRangeChange}
        onTileClick={(clickedResource) => {
          if (clickedResource) {
            setIdProject(clickedResource.id);
          }
        }}
        // onItemClick={(item) => {
        //   if (item) {
        //     window.location.href = `/admin/activity/scheduler/gantt/${item.id}`;
        //   }
        // }}
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
      <ModalUpdateProject
        ID={IdProject}
        setID={setIdProject}
        type="gantt"
        refBtnProject={refBtn as React.Ref<HTMLButtonElement>}
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
