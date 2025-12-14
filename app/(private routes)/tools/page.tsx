import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import ToolsGrid from "@/components/ToolsGrid/ToolsGrid";
import { getTools } from "@/lib/api/tools";
import type { ToolsApiResponse } from "@/types/tool";
import css from "./ToolsPage.module.css";

const PER_PAGE = 8;

const toPageNumber = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 1);

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["tools", "all"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getTools({
        page: toPageNumber(pageParam),
        perPage: PER_PAGE,
        categoryId: "all",
      }),
    getNextPageParam: (lastPage: ToolsApiResponse) => {
      if (!lastPage.page || !lastPage.totalPages) return undefined;
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
  });

  return (
    <section className={css.page}>
      <div className="container">
        <header className={css.header}>
          <h1 className={css.title}>Всі інструменти</h1>
        </header>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <ToolsGrid perPage={PER_PAGE} />
        </HydrationBoundary>
      </div>
    </section>
  );
}
