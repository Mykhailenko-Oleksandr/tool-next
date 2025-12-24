"use client";

import UserProfile from "@/components/UserProfile/UserProfile";
import css from "./ProfilePage.module.css";
import { User } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchToolsUserId } from "@/lib/api/clientApi";
import PrivateProfilePlaceholder from "@/components/PrivateProfilePlaceholder/PrivateProfilePlaceholder";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import LoadMoreButton from "@/components/LoadMoreButton/LoadMoreButton";
import { Tool } from "@/types/tool";
import Loader from "@/components/Loader/Loader";

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["tools", user._id],
    queryFn: ({ pageParam = 1 }) => fetchToolsUserId(user._id, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  const tools: Tool[] = data?.pages.flatMap((page) => page.tools) ?? [];

  return (
    //     <PaginationTools categories={categoriesResponse} />

    <section className={css.toolSection}>
      <div className="container">
        <h2 className={css.toolTitle}>Всі інструменти</h2>

        {!isLoading && tools.length === 0 && <PrivateProfilePlaceholder />}

        {isLoading && <Loader />}
        {isError && !data && <p>Щось пішло не так... Спробуйте ще.</p>}
        {isFetchingNextPage && !isLoading && <Loader />}

        {tools.length > 0 && (
          <>
            <ToolGrid tools={tools} />

            {hasNextPage && (
              <LoadMoreButton
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                loading={isFetchingNextPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
