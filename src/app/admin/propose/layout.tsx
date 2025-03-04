import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Đề xuất",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
