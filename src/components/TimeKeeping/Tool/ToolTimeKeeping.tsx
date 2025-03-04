// import { Button } from "antd";
import { AppDispatch, RootState } from "@/redux/store/store";
import { Button } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { HiOutlineArrowRightStartOnRectangle,HiOutlineArrowLeftStartOnRectangle } from "react-icons/hi2";
import usePostData from "@/hooks/usePostData";
import userService from "@/services/userService";
import { useDispatch } from "react-redux";
import { fetchTimekeeping } from "@/redux/store/slices/userSlices/get_timekeeping.slice";
import { checkTimekeeping } from "@/redux/store/slices/userSlices/check_timekeeping.slice";

// import { FaChartPie } from "react-icons/fa";

// type MenuItem = {
//   value: string;
//   label: string;
// };

// const { RangePicker } = DatePicker;

export default function ToolTimeKeeping() {
  const { postdata } = usePostData();
  // const [filterData, setFilterData] = useState<FilterPriceQuote>({});

  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   if (filterData) {
  //     dispatch(fetchPriceQuotes(filterData));
  //   }
  // }, [filterData]);
  const { datas: check } = useSelector(
    (state: RootState) => state.check_timekeepings
  );

  const handleTimeKeeping = async()=>{
    const statusCode = await postdata(()=> userService.createTimeKeeping())
    if(statusCode === 200 || statusCode === 201){
      dispatch(fetchTimekeeping({}))
      dispatch(checkTimekeeping())
    }
  }
  return (
    <div className="flex items-start gap-4 w-full flex-col">
      <div className="flex gap-1 items-center  pb-4  w-full flex-wrap">
        <Button
          className="bg-blue-400 border-0 text-white font-semibold"
          icon={check ?<HiOutlineArrowLeftStartOnRectangle /> : <HiOutlineArrowRightStartOnRectangle />}
          
          onClick={()=>{handleTimeKeeping()}}
        >
          {check ? 'Hoàn tất':'Bắt đầu công việc'}
        </Button>
      </div>

      {/* <div className="flex flex-wrap w-full items-center justify-end gap-2 "></div> */}
    </div>
  );
}
