import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreProvider } from "./StoreProvider";
import { DispatchProvider } from "./DispatchProvider";
// import Head from "next/head";
import CustomImage from "@/components/CustomImage/CustomImage";
import { Suspense } from "react";
import LayoutHeader from "./LayoutHeader";
// import CookieConsent from "./CookieConsent";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "Admin SPV",
    template: "%s | Admin",
  },
  description: "Admin project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <DispatchProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
          >
            <Suspense fallback={<>Loading...</>}>
            <LayoutHeader>
              {children}
            </LayoutHeader>
            
            
            </Suspense>

            <ToastContainer />
            <CustomImage />
            {/* <CookieConsent /> */}
          </body>
        </html>
      </DispatchProvider>
    </StoreProvider>
  );
}
