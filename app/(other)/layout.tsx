import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { ReactNode } from "react";

export default function OtherLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
}
