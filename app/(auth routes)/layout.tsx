"use client";

import Loader from "@/components/Loader/Loader";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    router.refresh();
    setLoading(false);
  }, [router]);

  return <>{loading ? <Loader /> : <main>{children}</main>}</>;
}
