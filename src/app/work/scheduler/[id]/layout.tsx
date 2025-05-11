"use client";
import { RootState } from "@/redux/store/store";
import { Menu, MenuProps } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// layout.tsx

type MenuItem = Required<MenuProps>["items"][number];
export default function Layout({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const { datas: dataType } = useSelector(
    (state: RootState) => state.get_type_work
  );
  const handleChange: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };
  useEffect(() => {
    if (dataType) {
      setItems(
        dataType.map((dt) => {
          return { label: dt.name, key: dt.type_work_id };
        })
      );
    }
  }, [dataType]);
  return (
    <>
      <div className="h-full">
        <Menu
          theme="dark"
          onClick={handleChange}
          selectedKeys={[id as string]}
          mode="horizontal"
          items={items}
        />
        {children}
      </div>
    </>
  );
}
