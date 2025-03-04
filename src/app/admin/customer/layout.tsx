import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Khách hàng",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
