/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGetActivity } from "@/models/activityInterface";
import activityService from "@/services/activityService";
import { Scheduler, SchedulerData } from "@bitnoi.se/react-scheduler";
import "@bitnoi.se/react-scheduler/dist/style.css";
import dayjs from "dayjs";
import enDayjsTranslations from "dayjs/locale/en";
import viDayjsTranslations from "dayjs/locale/vi";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { useCallback, useEffect, useRef, useState } from "react";
import ModalUpdateActivity from "../../Tool/Modal/ModalUpdateActivity/ModalUpdateActivity";
import useMedia from "use-media";

type Props = {
  ID: string;
};

export default function Component({ ID }: Props) {
  const isMobile = useMedia({ maxWidth: 639 });
  const [dataActivity, setActivity] = useState<IGetActivity[]>();
  const refBtn = useRef<HTMLButtonElement>();
  const [filterButtonState, setFilterButtonState] = useState(0);
  const [IdActivity, setIdActivity] = useState<string>("");
  const [mockedSchedulerData, setMockedSchedulerData] = useState<SchedulerData>(
    []
  );
  const fetchData = async () => {
    const res = await activityService.getActivityByContract(ID);
    if (res.statusCode === 200) {
      setActivity(res.data);
    }
  };
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
    if (ID) {
      fetchData();
    }
  }, [ID]);
  useEffect(() => {
    if (dataActivity) {
      setMockedSchedulerData(
        dataActivity.map((dt) => {
          return {
            id: dt.activity_id,
            label: {
              subtitle: dt.description || "",
              title: dt.name || "",
              icon: dt?.picture_urls?.[dt?.picture_urls?.length - 1]?.url ?? "",
            },
            data: dt?.works?.map((dtt) => {
              return {
                id: dtt.work_id,
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
  }, [dataActivity]);
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleRangeChange = useCallback((range: any) => {
    setRange(range);
  }, []);

  const filteredMockedSchedulerData = mockedSchedulerData.map((person) => ({
    ...person,
    data: person.data?.filter(
      (project) =>
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
        isLoading={!dataActivity ? true : false}
        onRangeChange={handleRangeChange}
        onTileClick={(clickedResource) => console.log(clickedResource)}
        onItemClick={(item) => {
          if (item) {
            setIdActivity(item.id);
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
      <ModalUpdateActivity
        ID={IdActivity}
        refBtn={refBtn as React.Ref<HTMLButtonElement>}
        type="gantt"
        setID={setIdActivity}
        fetchData={fetchData}
      />
    </section>
  );
}
