import { Button, Tag } from "antd";
import React from "react";
import { FaChartPie } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
import ModalAddContract from "./Modal/ModalContract";
import ModalTypeContract from "./Modal/ModalTypeContract/ModalTypeContract";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useParams } from "next/navigation";

// type MenuItem = {
//   value: string;
//   label: string;
// };

// const { RangePicker } = DatePicker;

export default function ToolContract() {
  // const [filterData, setFilterData] = useState<FilterPriceQuote>({});

  // const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   if (filterData) {
  //     dispatch(fetchPriceQuotes(filterData));
  //   }
  // }, [filterData]);
  // const { data: dataUsers } = useFetchData<InfoUser[]>(userService.getUsers);

  const { datas: dataAbout } = useSelector(
    (state: RootState) => state.get_contract_about
  );
  const { customerID } = useParams();
  // const [itemProject, setItemProject] = useState<MenuItem[]>([]);

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
        <ModalAddContract />
        <ModalTypeContract />

        <Button icon={<FaChartPie />} hidden={customerID ? true : false} />
      </div>
      <div className="w-full" hidden={customerID ? true : false}>
        <h2 className="font-semibold text-[#1BA399]">Tổng quan hợp đồng</h2>
        <div className="flex justify-around gap-2 flex-wrap">
          <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 border-0 shadow-lg shadow-black/20 bg-[#EB8823]">
            <p className="font-bold text-3xl text-white">
              {dataAbout?.contractTotal.toLocaleString("vi-VN")}
            </p>
            <p className="text-xs text-wrap text-slate-50/80 min-w-36">
              Tổng số hợp đồng
            </p>
          </Tag>
          <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
            <p className="font-bold text-3xl text-white">
              {dataAbout?.contractActive.toLocaleString("vi-VN")}
            </p>
            <p className="text-xs text-wrap text-slate-50/80 min-w-36">
              Đang hoạt động
            </p>
          </Tag>
          <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
            <p className="font-bold text-3xl text-white">
              {dataAbout?.contractReadyExpired.toLocaleString("vi-VN")}
            </p>
            <p className="text-xs text-wrap text-slate-50/80 min-w-36">
              Sắp hết hạn
            </p>
          </Tag>
          <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
            <p className="font-bold text-3xl text-white">
              {dataAbout?.contractExpired.toLocaleString("vi-VN")}
            </p>
            <p className="text-xs text-wrap text-slate-50/80 min-w-36">
              Hết hạn
            </p>
          </Tag>
          {/*<Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
            <p className="font-bold text-3xl text-white">
              {dataAbout?.contactInactive.toLocaleString("vi-VN")}
            </p>
            <p className="text-xs text-wrap text-slate-50/80 min-w-36">
              Liên hệ ít hoạt động
            </p>
          </Tag>
          <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
            <p className="font-bold text-3xl text-white">
              {dataAbout?.contactActiveToday.toLocaleString("vi-VN")}
            </p>
            <p className="text-xs text-wrap text-slate-50/80 min-w-36">
              Liên hệ đăng nhập hôm nay
            </p>
          </Tag> */}
        </div>
      </div>
    </div>
  );
}
