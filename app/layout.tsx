// app/layout.tsx
import "modern-normalize";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";

// Fonts
import { Nunito_Sans } from "next/font/google";
import { Inter } from "next/font/google";

// Components
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #hero {
                background-image: url('/images/hero-mob.jpg');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${nunitoSans.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            {children}

            <Toaster />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
