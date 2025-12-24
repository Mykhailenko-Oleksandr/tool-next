import PaginationTools from "@/components/PaginationTools/PaginationTools";
import css from "./Tools.module.css";
import { Metadata } from "next";
import { fetchCategories } from "@/lib/api/serverApi";
import { HydrationBoundary } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Каталог інструментів",
  description: "Всі інструменти доступні для перегляду та оренди",
  openGraph: {
    title: "Каталог інструментів",
    description: "Всі інструменти доступні для перегляду та оренди",
    siteName: "ToolNext",
  },
};

export default async function Tools() {
  const categoriesResponse = await fetchCategories();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileClient user={user} />
    </HydrationBoundary>
  );
}
