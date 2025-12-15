// app/layout.tsx
import "modern-normalize";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import TestModalWrapper from "@/components/TestModalWrapper/TestModalWrapper"; 
import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";

const NunitoSans = Nunito_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-NunitoSans",
  display: "swap",
});

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className={`${WorkSans.variable} ${NunitoSans.variable}`}>
        <TanStackProvider>
          {children}

          <TestModalWrapper /> {/* здесь модалка для теста */}

          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}
