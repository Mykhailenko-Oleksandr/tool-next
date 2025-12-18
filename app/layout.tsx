// app/layout.tsx
import "modern-normalize";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Fonts
import { Nunito_Sans } from 'next/font/google';
import { Inter } from 'next/font/google';

// Components
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Metadata } from "next";

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-Inter',
  display: 'swap',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400'],
  variable: '--font-NunitoSans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ToolNext",
  description:
    "ToolNext — платформа для зручної оренди інструментів. Знайди потрібне обладнання для ремонту чи хобі поруч із тобою та орендуй у кілька кліків. Власники можуть легко додавати інструменти, керувати оголошеннями та заробляти на простоюючому обладнанні. Швидка, доступна і вигідна оренда для всіх.",
  openGraph: {
    title: "ToolNext",
    description: "ToolNext — оренда інструментів у кілька кліків",

    url: "https://tool-next-chi.vercel.app",
    images: [
      {
        url: "https://res.cloudinary.com/ddln4hnns/image/upload/v1765352917/cover_kkf3m7.jpg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} ${nunitoSans.variable}`}>
        <TanStackProvider>
          <Header />

          <main>{children}</main>

          <Footer />
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}
