import { Metadata } from "next";

// layout.tsx
export const metadata: Metadata = {
  title: "Chấm công",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
