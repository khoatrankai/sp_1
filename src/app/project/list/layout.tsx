import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Dự án mới",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
