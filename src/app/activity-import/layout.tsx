import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Nhập kho",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
