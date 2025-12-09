import "modern-normalize";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { Nunito_Sans } from "next/font/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Components
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const WorkSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-WorkSans",
  display: "swap",
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
          {/* <Header /> */}

          {children}

          {/* <Footer /> */}
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}
