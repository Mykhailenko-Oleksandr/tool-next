import "modern-normalize";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import localFont from "next/font/local";
import { Nunito_Sans } from "next/font/google";

import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const WorkSans = localFont({
  src: [
    { path: "../public/fonts/WorkSans/WorkSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/WorkSans/WorkSans-Regular.woff", weight: "400", style: "normal" },
    { path: "../public/fonts/WorkSans/WorkSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/WorkSans/WorkSans-Medium.woff", weight: "500", style: "normal" },
    { path: "../public/fonts/WorkSans/WorkSans-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/WorkSans/WorkSans-SemiBold.woff", weight: "600", style: "normal" },
    { path: "../public/fonts/WorkSans/WorkSans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/WorkSans/WorkSans-Bold.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-WorkSans",
});

const NunitoSans = Nunito_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-NunitoSans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ToolNext",
  description: "",
  openGraph: {
    title: "ToolNext",
    description: "",
    url: "",
    images: [{ url: "" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${WorkSans.variable} ${NunitoSans.variable}`}>
        <TanStackProvider>
          {children}
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}
