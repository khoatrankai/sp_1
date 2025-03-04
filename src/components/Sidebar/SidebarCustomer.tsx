import { Menu } from "antd";
import Link from "next/link";
import React from "react";
import { TbZoomMoney } from "react-icons/tb";
import { PiProjectorScreenChartFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { toggleMenu } from "@/redux/store/slices/menu.slice";
import useMedia from "use-media";
import { FaUserTie } from "react-icons/fa";

// type Props = {};

// type MenuItem = Required<MenuProps>["items"][number];

const SidebarCustomer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMedia({ maxWidth: 639 });
  // const { datas: dataRoleAccess } = useSelector(
  //   (state: RootState) => state.get_access_roles
  // );
  const isOpen = useSelector((state: RootState) => state.status_tab_menu);
  const itemsMenu = [
    {
      key: "customer",
      label: (
        <Link
          href="/customer/company"
          className=""
          onClick={() => {
            if (isMobile) dispatch(toggleMenu());
          }}
        >
          <span>Danh sách công ty</span>
        </Link>
      ),
      icon: <FaUserTie />,
    },
    {
      key: "project",
      label: "Dự án",
      icon: <PiProjectorScreenChartFill />,
      children: [
        {
          key: "list_project",
          label: (
            <Link
              href="/customer/project"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Danh sách dự án</span>
            </Link>
          ),
        },
      ],
    },
    {
      key: "sale",
      label: "Tài liệu",
      icon: <TbZoomMoney />,
      children: [
        {
          key: "price_quote",
          label: (
            <Link
              href="/customer/price_quote"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Báo giá</span>
            </Link>
          ),
        },
        {
          key: "contract",
          label: (
            <Link
              href="/customer/contract"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Hợp đồng</span>
            </Link>
          ),
        },
        {
          key: "invoice",
          label: (
            <Link
              href="/customer/payment"
              className=""
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Hóa đơn</span>
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

export default SidebarCustomer;
