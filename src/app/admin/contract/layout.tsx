import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Hợp đồng",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
