import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Nhà thầu",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
