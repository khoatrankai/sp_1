import { Menu, Select } from "antd";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { toggleMenu } from "@/redux/store/slices/menu.slice";
import useMedia from "use-media";
import { IoIosAdd } from "react-icons/io";
import { AiOutlineDashboard } from "react-icons/ai";

// type Props = {};

// type MenuItem = Required<MenuProps>["items"][number];

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMedia({ maxWidth: 639 });
  // const { datas: dataRoleAccess } = useSelector(
  //   (state: RootState) => state.get_access_roles
  // );
  const isOpen = useSelector((state: RootState) => state.status_tab_menu);
  const itemsMenu = [
    {
      key: "dashboard",
      label: (
        <Link
          href="/detail/project/dashboard"
          className=""
          onClick={() => {
            if (isMobile) dispatch(toggleMenu());
          }}
        >
          <span>Thống kê</span>
        </Link>
      ),
      icon: <AiOutlineDashboard />,
    },
    {
      key: "project_close",
      label: (
        <Link
          href="/detail/project/close"
          className=""
          onClick={() => {
            if (isMobile) dispatch(toggleMenu());
          }}
        >
          <span>Dự án đóng</span>
        </Link>
      ),
    },
    {
      key: "project_process",
      label: (
        <Link
          href="/detail/project/close"
          className=""
          onClick={() => {
            if (isMobile) dispatch(toggleMenu());
          }}
        >
          <span>Dự án đang thực hiện</span>
        </Link>
      ),
    },
    {
      key: "project_full",
      label: (
        <div className="flex w-full justify-between items-center">
 <Link
          href="/detail/project"
          className="flex-1"
          onClick={() => {
            if (isMobile) dispatch(toggleMenu());
          }}
        >
          <span>
            <p>
            Dự án
            </p>
         
          
            </span>
        </Link>
        <span onClick={()=>{
            }}>
            <IoIosAdd />
            </span>
        </div>
       
      ),
    }
  ];
  return (
    <div
      className={`transition-all max-h-full fixed bottom-0 left-0 top-16 overflow-y-auto flex flex-col items-center ${
        isOpen.isOpen ? "sm:w-52 w-full" : "w-0 "
      }`}
    >
      <Select
                placeholder="Tìm kiếm dự án"
                // onChange={(e) => {
                //   setFilterData({ ...filterData, status: e });
                // }}
                showSearch
                allowClear
                filterOption={(input, option) => {
                  return ((option?.label ?? "") as string)
                    .toLowerCase()
                    .includes(input.toLowerCase());
                }}
                className="mt-4 w-40"
                // options={dataTypeActivity
                //   .find((dt) => dt.type_activity_id === filterData.type)
                //   ?.status?.map((dt) => {
                //     return { value: dt.status_activity_id, label: dt.name };
                //   })}
              />
      <Menu
        //   onClick={onClick}
        style={{ width: "100%" }}
        theme="light"
        color="white"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={itemsMenu}
      />
    </div>
  );
};

export default Sidebar;
