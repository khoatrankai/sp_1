import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Nhà cung ứng",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
