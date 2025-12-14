"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import css from "./ToolsGrid.module.css";
import { getTools } from "@/lib/api/tools";
import ToolCard from "@/components/ToolCard/ToolCard";
import type { Tool } from "@/types/tool";

type Props = {
  perPage?: number;
};

export default function ToolsGrid({ perPage = 8 }: Props) {
  const toolsQuery = useInfiniteQuery({
    queryKey: ["tools", "all"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getTools({
        page: pageParam as number,
        perPage,
        categoryId: "all",
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage?.page || !lastPage?.totalPages) return undefined;
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
  });

  const tools: Tool[] = useMemo(() => {
    const pages = toolsQuery.data?.pages ?? [];
    return pages.flatMap((p) => (Array.isArray(p.items) ? p.items : []));
  }, [toolsQuery.data]);

  const isLoading = toolsQuery.isLoading;
  const isError = toolsQuery.isError;

  if (isLoading) return <div className={css.loader}>Завантаження...</div>;
  if (isError) return <div className={css.error}>Сталася помилка. Спробувати ще</div>;
  if (tools.length === 0) return <div className={css.placeholder}>Нічого не знайдено</div>;

  return (
    <>
      <div className={css.grid}>
        {tools.map((t) => (
          <div className={css.cardItem} key={t._id}>
            <ToolCard tool={t} />
          </div>
        ))}
      </div>

      <div className={css.loadMoreWrapper}>
        <button
          type="button"
          className={css.loadMoreButton}
          onClick={() => toolsQuery.fetchNextPage()}
          disabled={!toolsQuery.hasNextPage || toolsQuery.isFetchingNextPage}
        >
          {toolsQuery.isFetchingNextPage ? "Завантаження..." : "Показати ще"}
        </button>
      </div>

      {toolsQuery.isFetchingNextPage ? (
        <div className={css.loader}>Завантаження...</div>
      ) : null}
    </>
  );
}
