import "modern-normalize";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Note Hub",
  description:
    "Keep your ideas safe and simple with Note Hub — a clean, fast, and reliable personal notebook without the clutter.",
  openGraph: {
    title: "Note Hub",
    description:
      "Note Hub is a clean and minimal personal notebook for capturing your thoughts and ideas. Fast, reliable, and distraction-free — your space to think clearly.",
    url: "https://08-zustand-blush-beta.vercel.app",
    images: [
      { url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg" },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            <Header />

            {children}
            {modal}

            <Footer />
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
