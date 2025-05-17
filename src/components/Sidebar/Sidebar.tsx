import { Menu } from "antd";
import Link from "next/link";
import React from "react";
import { GrMoney, GrSystem, GrUserWorker } from "react-icons/gr";
import { FaUser, FaUserTie } from "react-icons/fa";
import { TbActivityHeartbeat, TbZoomMoney } from "react-icons/tb";
import { PiProjectorScreenChartFill } from "react-icons/pi";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { LuContainer } from "react-icons/lu";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { toggleMenu } from "@/redux/store/slices/menu.slice";
import useMedia from "use-media";

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
      key: "asset",
      label: (
        <Link
          href="/asset"
          className=""
          onClick={() => {
            if (isMobile) dispatch(toggleMenu());
          }}
        >
          <span>Quản lý tài sản</span>
        </Link>
      ),
      icon: <GrMoney />,
    },
    {
      key: "contractor",
      label: (
        <Link
          href="/contractor"
          className=""
          onClick={() => {
            if (isMobile) dispatch(toggleMenu());
          }}
        >
          <span>Quản lý nhà thầu</span>
        </Link>
      ),
      icon: <GrUserWorker />,
    },
    {
      key: "customer",
      label: (
        <Link
          href="/customer"
          className=""
          onClick={() => {
            if (isMobile) dispatch(toggleMenu());
          }}
        >
          <span>Khách hàng</span>
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
              href="/project"
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
      label: "Bán hàng",
      icon: <TbZoomMoney />,
      children: [
        {
          key: "price_quote",
          label: (
            <Link
              href="/price_quote"
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
              href="/contract"
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
              href="/payment"
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
    {
      key: "user",
      label: "Nhân viên",
      icon: <FaUser />,
      children: [
        {
          key: "users",
          label: (
            <Link
              href="/user"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Danh sách nhân viên</span>
            </Link>
          ),
        },
        {
          key: "timekeeping",
          label: (
            <Link
              href="/timekeeping"
              className=""
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Chấm công</span>
            </Link>
          )
        }
      ],
    },
    {
      key: "opportunity",
      label: "Cơ hội",
      icon: <AiOutlineFundProjectionScreen />,
      children: [
        {
          key: "list_opportunity",
          label: (
            <Link
              href="/opportunity"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Danh sách cơ hội</span>
            </Link>
          ),
        },
        {
          key: "dashboard_opportunity",
          label: (
            <Link
              href="/opportunity/dashboard"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Thống kê</span>
            </Link>
          ),
        },
      ],
    },

    {
      key: "activity",
      label: "Hoạt động",
      icon: <TbActivityHeartbeat />,
      children: [
        {
          key: "list_activity",
          label: (
            <Link
              href="/activity"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Danh sách hoạt động</span>
            </Link>
          ),
        },
        // {
        //   key: "activity_require",
        //   label: (
        //     <Link href="/activity/require">
        //       <span>Yêu cầu khách hàng</span>
        //     </Link>
        //   ),
        // },
        {
          key: "activity_work",
          label: (
            <Link
              href="/work"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Danh sách công việc</span>
            </Link>
          ),
        },
        // {
        //   key: "activity_schedule",
        //   label: (
        //     <Link href="/activity/schedule">
        //       <span>Lịch trình</span>
        //     </Link>
        //   ),
        // },
      ],
    },
    {
      key: "container",
      label: "Kho hàng",
      icon: <LuContainer />,
      children: [
        {
          key: "list_product",
          label: (
            <Link
              href="/product"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Danh sách sản phẩm</span>
            </Link>
          ),
        },
        {
          key: "list_supplier",
          label: (
            <Link
              href="/supplier"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Nhà cung ứng</span>
            </Link>
          ),
        },
        {
          key: "list_product_input",
          label: (
            <Link
              href="/activity-import"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Nhập kho</span>
            </Link>
          ),
        },
        {
          key: "list_product_output",
          label: (
            <Link
              href="/activity-export"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Xuất kho</span>
            </Link>
          ),
        },
        {
          key: "list_product_status",
          label: (
            <Link
              href="/activity-status"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Trạng thái sản phẩm</span>
            </Link>
          ),
        },
      ],
    },
    
    {
      key: "system",
      label: "Hệ thống",
      icon: <GrSystem />,
      children: [
        {
          key: "vat",
          label: (
            <Link
              href="/system/vat"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Thuế</span>
            </Link>
          ),
        },
        {
          key: "profit",
          label: (
            <Link
              href="/system/profit"
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Lợi nhuận</span>
            </Link>
          ),
        },
        {
          key: "link",
          label: (
            <Link
              href="/system/link"
              className=""
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Link hệ thống</span>
            </Link>
          ),
        },
        {
          key: "target",
          label: (
            <Link
              href="/system/target"
              className=""
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Mục tiêu</span>
            </Link>
          ),
        },
        {
          key: "report",
          label: (
            <Link
              href="/system/report"
              className=""
              onClick={() => {
                if (isMobile) dispatch(toggleMenu());
              }}
            >
              <span>Báo cáo</span>
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

export default Sidebar;
