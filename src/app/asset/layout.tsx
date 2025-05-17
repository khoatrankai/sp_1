import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Tài sản",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
