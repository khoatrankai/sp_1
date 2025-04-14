import { Menu } from "antd";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { toggleMenu } from "@/redux/store/slices/menu.slice";
import useMedia from "use-media";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { MdOutlineWorkHistory } from "react-icons/md";

// type Props = {};

// type MenuItem = Required<MenuProps>["items"][number];

const SidebarManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMedia({ maxWidth: 639 });
  // const { datas: dataRoleAccess } = useSelector(
  //   (state: RootState) => state.get_access_roles
  // );
  const isOpen = useSelector((state: RootState) => state.status_tab_menu);
  const itemsMenu = [
    
    {
      key: "work",
      label: "Công việc",
      icon: <HiClipboardDocumentCheck />,
      children: [
        {
          key: "process_work",
          label: (
            <Link
              href="/management/all_work?type=perform"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Bạn thực hiện</span>
            </Link>
          ),
        },
        {
          key: "assigned_work",
          label: (
            <Link
              href="/management/all_work?type=assigned"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Bạn đã giao</span>
            </Link>
          ),
        },
        {
          key: "department_work",
          label: (
            <Link
              href="/management/all_work?type=group"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Phong ban bạn</span>
            </Link>
          ),
        },
        {
          key: "all_work",
          label: (
            <Link
              href="/management/all_work"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Tất cả</span>
            </Link>
          ),
        },
      ],
    },
    {
      key: "project",
      label: "Dự án",
      icon: <MdOutlineWorkHistory />,
      children: [
        {
          key: "do_project",
          label: (
            <Link
              href="/management/all_project?type=perform"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Bạn thực hiện</span>
            </Link>
          ),
        },
        {
          key: "management_work",
          label: (
            <Link
              href="/management/all_project?type=management"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Bạn quản trị</span>
            </Link>
          ),
        },
        {
          key: "follow_project",
          label: (
            <Link
              href="/management/all_project?type=follow"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Bạn theo dõi</span>
            </Link>
          ),
        },
        {
          key: "department_project",
          label: (
            <Link
              href="/management/all_project?type=group"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Phòng ban bạn</span>
            </Link>
          ),
        },
        {
          key: "all_project",
          label: (
            <Link
              href="/management/all_project"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Tất cả</span>
            </Link>
          ),
        },
      ],
    },
  ];
  return (
    <div
      className={`transition-all bg-[#1A2A36] max-h-full fixed bottom-0 left-0 top-16 overflow-y-auto py-4 ${
        isOpen.isOpen ? "sm:w-52 w-full" : "w-0 "
      }`}
    >
      <Menu
        //   onClick={onClick}
        defaultValue={'all_project'}
        className="bg-[#1A2A36] !text-white"
        style={{ width: "100%" }}
        theme="dark"
        color="white"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={itemsMenu}
      />
    </div>
  );
};

export default SidebarManagement;
