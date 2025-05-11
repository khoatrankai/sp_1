import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Chi tiết sản phẩm",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
