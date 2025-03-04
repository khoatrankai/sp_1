import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Hoạt động",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
