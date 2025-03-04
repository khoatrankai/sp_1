import { AppDispatch, RootState } from "@/redux/store/store";
import {
  Button,
  DatePicker,
  Dropdown,
  MenuProps,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// import useCheckRole from "@/utils/CheckRole";
import { useSearchParams } from "next/navigation";
import { IGetTimeKeeping } from "@/models/userInterface";
import { fetchTimekeeping } from "@/redux/store/slices/userSlices/get_timekeeping.slice";
import { fetchUserFilter } from "@/redux/store/slices/userSlices/get_filter_user.slice";
import dayjs from "dayjs";
import { FaRegFileExcel } from "react-icons/fa";
import exportToExcel from "../Export/Excel";
import { MdKeyboardArrowDown } from "react-icons/md";
import userService from "@/services/userService";

export default function ListTimeKeeping() {


  const items: MenuProps["items"] = [
      {
        label: "Excel",
        key: "excel",
        icon: <FaRegFileExcel />,
      },
    ];
    const handleMenuClick: MenuProps["onClick"] = (e) => {
      if (e.key === "excel") {
        ExportExcel();
      }
    };
    const menuProps = {
      items,
      onClick: handleMenuClick,
    };
  
   

  const { RangePicker } = DatePicker;
  const [pageLimit, setPageLimit] = useState<number>(25);
  const [timeFirst, setTimeFirst] = useState<number>(
      new Date(new Date().getFullYear(),0,1).getTime()
    );
    const [timeEnd, setTimeEnd] = useState<number>(
      new Date(new Date().getFullYear()+1,0,1).getTime()
    );
  const [filterData, setFilterData] = useState({user_id:undefined,group:undefined});
  // const isAuthorized = useCheckRole(["admin-top", "user", "user-edit"]);
  const [itemGroup, setItemGroup] = useState<
    { value: string; label: string }[]
  >([]);
  const [itemUser, setItemUser] = useState<
    { value: string; label: string }[]
  >([]);
  const { datas: dataGroup } = useSelector(
    (state: RootState) => state.get_group_user
  );

  const { datas: dataUser } = useSelector(
    (state: RootState) => state.get_filter_user
  );
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_timekeepings
  );
  const [dataFilter, setDataFilter] = useState<IGetTimeKeeping[] | [] | undefined>([]);

  const ExportExcel = async() => {
    const customeData = await userService.getTimeKeepingPerson({user_id:filterData.user_id ?? "",start_time:timeFirst,end_time:timeEnd})
    const userInfo = dataUser.find(dt => dt.user_id === filterData?.user_id)
    exportToExcel(userInfo?.first_name+" "+userInfo?.last_name,customeData);
  };

  const columns: TableColumnsType<IGetTimeKeeping> = [
    {
      title: "#",
      className: "text-xs",
      dataIndex: "timekeeping_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong className="flex gap-2 items-center">
            
            #{index + 1}
          </strong>
        
        </div>
      ),
      sorter: (a: IGetTimeKeeping, b: IGetTimeKeeping) => a.timekeeping_id.localeCompare(b.timekeeping_id),
    },
    {
      title: "Họ và tên",
      className: "text-xs",
      dataIndex: '',
      render: (value, record) => (
        <>
          {record?.user_info?.first_name} {record?.user_info?.last_name}
        </>
      ),
      sorter: (a: IGetTimeKeeping, b: IGetTimeKeeping) =>
        (a?.user_info?.first_name ?? "" + a?.user_info?.last_name).localeCompare(b?.user_info?.first_name ?? "" + b?.user_info?.last_name),
    },
    {
      title: "Thời gian vào",
      className: "text-xs",
      dataIndex: "time_start",
      render: (value) => <>{new Date(value)?.toLocaleString("vi-VN", { 
    timeZone: "UTC", 
    hour12: false 
})}</>,
      sorter: (a: IGetTimeKeeping, b: IGetTimeKeeping) => a.time_start.toDateString().localeCompare(b.time_start.toDateString()),
    },
    {
      title: "Thời gian ra",
      className: "text-xs",
      dataIndex: "time_end",
      render: (value,record) => <>{record.completed && new Date(value)?.toLocaleString("vi-VN", { 
    timeZone: "UTC", 
    hour12: false 
})}</>,
      sorter: (a: IGetTimeKeeping, b: IGetTimeKeeping) => a.time_end.toDateString().localeCompare(b.time_end.toDateString()),
    },
    {
      title: "Trạng thái",
      className: "text-xs",
      dataIndex: "completed",
      render: (value) => <>{value ?  <Tag color="success">Đã hoàn thành</Tag>:<Tag color="processing">Đang làm</Tag>}</>
    },
    
  ];
  useEffect(() => {
    if (dataGroup) {
      const customData =
        dataGroup.map((dt) => {
          return { value: dt.group_id, label: dt.name_group ?? "" };
        }) ?? [];
      setItemGroup([...customData]);
    }
  }, [dataGroup]);

  useEffect(() => {
    if (dataUser) {
      const customData =
      dataUser.map((dt) => {
          return { value: dt.user_id, label: dt.first_name +" "+dt.last_name };
        }) ?? [];
      setItemUser([...customData]);
    }
  }, [dataUser]);
  useEffect(() => {
      dispatch(
        fetchTimekeeping(filterData)
      );
    
  }, [filterData]);

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSources?.filter((dt) => {
        return String(
          dt.user_info.first_name +
            " " +
            dt.user_info.last_name +
            " " +
            dt.time_start+" "+dt.time_end+
            " " +
            dt.timekeeping_id
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  const dispatch = useDispatch<AppDispatch>();
 
 
  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get("id");
    if (dataSources && id) {
      handleSearchFilter(id);
    } else {
      setDataFilter(
        dataSources.map((dt, index) => {
          return { ...dt, key: index };
        })
      );
    }
  }, [dataSources, searchParams]);
  return (
    <div className="">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-y-2">
        <div className="flex items-center gap-1">
          <Select
            defaultValue={pageLimit}
            style={{ width: 83 }}
            onChange={(e) => setPageLimit(e)}
            options={[
              { value: 10, label: 10 },
              { value: 25, label: 25 },
              { value: 50, label: 50 },
              { value: 100, label: 100 },
              { value: 500, label: 500 },
              { value: 1000, label: 1000 },
              { value: 100000000, label: "Tất cả" },
            ]}
          />
         <Dropdown menu={menuProps}>
            <Button>
              <Space>Xuất ra</Space>
              <MdKeyboardArrowDown />
            </Button>
          </Dropdown>
          <RangePicker
                      className="sm:w-auto w-full"
                      picker={"date"}
                      value={[dayjs(timeFirst), dayjs(timeEnd)]}
                      onChange={(e, values) => {
                   
                          setTimeFirst(new Date(values[0]).getTime());
                          setTimeEnd(new Date(values[1]).getTime());
                        
                       
                      }}
                      // value={}
                    />
        </div>
        <div className="flex gap-2 items-center">
         
          <Select
            placeholder="Phòng ban"
            style={{ minWidth: 120, flex: "1 1 0%" }}
            onChange={(e) => {
              if(e !== "" ){
                setFilterData({...filterData,group:e})
                dispatch(fetchUserFilter({group:e}))
              }else{
                setFilterData({...filterData,group:undefined});
                dispatch(fetchUserFilter({}))
              }
              
            }}
            showSearch
            allowClear
            filterOption={(input, option) => {
              const text = Array.isArray(option?.label)
                ? option.label.join("")
                : option?.label ?? "";
              return text.toLowerCase().includes(input.toLowerCase());
            }}
            options={itemGroup}
          />
           <Select
            placeholder="Nhân viên"
            style={{ minWidth: 120, flex: "1 1 0%" }}
            onChange={(e) => {
              if(e !== "" ){
                setFilterData({...filterData,user_id:e})
              }else{
                setFilterData({...filterData,user_id:undefined});
              }
            }}
            showSearch
            allowClear
            filterOption={(input, option) => {
              const text = Array.isArray(option?.label)
                ? option.label.join("")
                : option?.label ?? "";
              return text.toLowerCase().includes(input.toLowerCase());
            }}
            options={itemUser}
          />
          <Search
            onChange={(e) => {
              handleSearchFilter(e.target.value);
            }}
            placeholder="Tìm kiếm"
            style={{ width: 200 }}
          />
        </div>
      </div>
      <div className="w-full overflow-auto">
        <div className="min-w-fit">
          <Table<IGetTimeKeeping>
            columns={columns}
            dataSource={dataFilter}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: pageLimit, // Items per page
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            showSorterTooltip={{ target: "sorter-icon" }}
          />
        </div>
      </div>
    </div>
  );
}
