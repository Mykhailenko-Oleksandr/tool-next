import "modern-normalize";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Fonts
import { Nunito_Sans } from "next/font/google";
import { Inter } from "next/font/google";

// Components
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ToolCard from "@/components/ToolCard/ToolCard";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Inter",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-NunitoSans",
  display: "swap",
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

const toolOne = {
  id: "692db3ffab59e437964311d4",
  owner: "6881563901add19ee16fcffa",
  category: "6704d9c7f1a3b8c2d5e4f6a8",
  name: "Мийка високого тиску акумуляторна Karcher K 2 Battery",
  description:
    "Повністю автономна мийка, яка не потребує підключення до електромережі…",
  pricePerDay: 250,
  images: "https://ftp.goit.study/img/tools-next/692db3ffab59e437964311d4.webp",
  rating: 4,
  specifications: {
    Тиск: "110 бар",
    Продуктивність: "340 л/год",
    Часроботи: "14 хв (стандарт)",
    Акумулятор: "36 В",
    Вага: "4.5 кг",
  },
  rentalTerms: "Застава 2500 грн. Паспорт.",
  bookedDates: [],
  feedbacks: [
    { id: "692db3ffab59e43796432001" },
    { id: "692db3ffab59e43796432002" },
  ],
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

          <main>
            <ToolCard tool={toolOne} />
            {children}
          </main>

          <Footer />
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}
