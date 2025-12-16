import 'modern-normalize';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Fonts
import { Nunito_Sans } from 'next/font/google';
import { Inter } from 'next/font/google';

// Components
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
// import Footer from "@/components/Footer/Footer";

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
  title: 'ToolNext',
  description: '',
  openGraph: {
    title: 'ToolNext',
    description: '',
    url: '',
    images: [{ url: '' }],
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
      <body className={`${inter.variable} ${nunitoSans.variable}`}>
        <TanStackProvider>
          <Header />

          {children}
          <p>12</p>

          {/* <Footer /> */}
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}
