import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Lịch trình",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
