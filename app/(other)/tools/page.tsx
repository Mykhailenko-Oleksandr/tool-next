import ToolsClient from "./Tools.client";
import { fetchCategories } from "@/lib/api/clientApi";
import { fetchTools } from "@/lib/api/clientApi";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { Metadata } from "next";
import css from "./Tools.module.css";

export const metadata: Metadata = {
  title: "Каталог інструментів",
  description: "Всі інструменти доступні для перегляду та оренди",
  openGraph: {
    title: "Каталог інструментів — ToolNext",
    description:
      "Всі інструменти доступні для перегляду та оренди на ToolNext: опис, характеристики, фото та умови оренди.",
    url: "https://tool-next-chi.vercel.app/tools",
    images: [
      {
        url: "https://res.cloudinary.com/ddln4hnns/image/upload/v1765352917/cover_kkf3m7.jpg",
      },
    ],
  },
};

type Props = {
  searchParams: Promise<{ search?: string }>;
};

const Tools = async ({ searchParams }: Props) => {
  const { search = "" } = await searchParams;

  const queryClient = new QueryClient();
  const categoriesResponse = await fetchCategories();
  const sortCategories = categoriesResponse.toSorted((a, b) =>
    a.title.localeCompare(b.title)
  );

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["tools", search, []],
    queryFn: ({ pageParam = 1 }) =>
      fetchTools({
        page: pageParam,
        perPage: 16,
        search,
        categories: [],
      }),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className={css.toolSection}>
        <div className="container">
          <h2 className={css.toolTitle}>Всі інструменти</h2>
          <ToolsClient categories={sortCategories} initialSearch={search} />
        </div>
      </section>
    </HydrationBoundary>
  );
};

export default Tools;
