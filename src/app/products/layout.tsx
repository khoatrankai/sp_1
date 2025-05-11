import { Metadata } from "next";
import dynamic from "next/dynamic";
import "./styles.scss";
// layout.tsx
export const metadata: Metadata = {
  title: "Trang chủ",
};
const HeaderTTKbuy = dynamic(
  () => import("@/components/Page/Sell/HeaderTTKbuy/HeaderTTKbuy"),
  { ssr: false }
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="ttkbuy">
        <div className="h-20 header-menu">
          <HeaderTTKbuy />
        </div>

        {children}
      </div>
    </>
  );
}
