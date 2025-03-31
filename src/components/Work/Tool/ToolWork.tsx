import { Button } from "antd";
import React from "react";
import ModalAddWork from "./Modal/ModalWork";
import ModalTypeWork from "./Modal/ModalTypeWork/ModalTypeWork";
import ModalStatusWork from "./Modal/ModalStatusWork/ModalStatusWork";
import Link from "next/link";
import { FaTableCells } from "react-icons/fa6";
import { useParams } from "next/navigation";
import { IoIosList } from "react-icons/io";

// type MenuItem = {
//   value: string;
//   label: string;
// };

// const { RangePicker } = DatePicker;

export default function ToolWork() {
  const { projectID } = useParams();
  // const [filterData, setFilterData] = useState<FilterPriceQuote>({});

  // const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   if (filterData) {
  //     dispatch(fetchPriceQuotes(filterData));
  //   }
  // }, [filterData]);
  // const { data: dataUsers } = useFetchData<InfoUser[]>(userService.getUsers);

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
      <div className="flex gap-2 items-center w-full flex-wrap">
        {/* <Button
          className="bg-blue-400 border-0 text-white font-semibold"
          icon={<IoAddOutline />}
        >
          Thêm đề xuất
        </Button> */}
        <ModalAddWork />
        <div className="sm:block hidden">
          <ModalTypeWork />
        </div>
        <div className="sm:block hidden">
          <ModalStatusWork />
        </div>

        <Link href={"/admin/work/scheduler"} hidden={projectID ? true : false}>
          <Button icon={<FaTableCells />} />
        </Link>
        <Link href={`/management/all_work`}>
          <Button icon={<IoIosList  />} />
        </Link>
      </div>

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
