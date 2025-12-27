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

  const handleLoadMore = () => {
    const currentScrollPosition = window.pageYOffset;

    fetchNextPage().then(() => {
      setTimeout(() => {
        window.scrollTo({
          top: currentScrollPosition + 600,
          behavior: "smooth",
        });
      }, 100);
    });
  };

  return (
    <section className={css.profilePage}>
      <div className="container">
        <UserProfile user={user} />
        <div className={css.titleWrap}>
          <h2 className={css.profileToolsTitle}>Інструменти</h2>
        </div>

        {!isLoading && tools.length === 0 && <PrivateProfilePlaceholder />}

        {isLoading && <Loader />}
        {isError && !data && <p>Щось пішло не так... Спробуйте ще.</p>}
        {isFetchingNextPage && !isLoading && <Loader />}

        {tools.length > 0 && (
          <>
            <ToolGrid tools={tools} />

            {hasNextPage && (
              <LoadMoreButton
                onClick={handleLoadMore}
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
