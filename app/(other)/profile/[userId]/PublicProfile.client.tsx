"use client";

import UserProfile from "@/components/UserProfile/UserProfile";
import css from "./PublicProfile.module.css";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchToolsUserId, fetchUserFeedbacks } from "@/lib/api/clientApi";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import LoadMoreButton from "@/components/LoadMoreButton/LoadMoreButton";
import { Tool } from "@/types/tool";
import Loader from "@/components/Loader/Loader";
import PublicProfilePlaceholder from "@/components/PublicProfilePlaceholder/PublicProfilePlaceholder";
import ToolFeedbacksBlock from "@/components/ToolFeedbacksBlock/ToolFeedbacksBlock";
import { Feedback } from "@/types/feedback";
import { UserByIdResponse } from "@/lib/api/serverApi";

interface ProfileClientProps {
  user: UserByIdResponse;
}

export default function PublicProfileClient({ user }: ProfileClientProps) {
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

  const {
    data: userFeedbacks,
    isLoading: isFeedbacksLoading,
    isError: isFeedbacksError,
  } = useQuery({
    queryKey: ["feedbacks", "user", user._id],
    queryFn: () => fetchUserFeedbacks(user._id),
    staleTime: 5 * 60 * 1000,
  });

  const feedbacks: Feedback[] = userFeedbacks?.feedbacks ?? [];

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

        {!isLoading && tools.length === 0 && <PublicProfilePlaceholder />}

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

        {isFeedbacksLoading && <Loader />}
        {!isFeedbacksLoading && isFeedbacksError && (
          <p>Щось пішло не так... Спробуйте ще.</p>
        )}
        {!isFeedbacksLoading && !isFeedbacksError && (
          <ToolFeedbacksBlock
            feedbacks={feedbacks}
            emptyTitleMobileText="У цього користувача немає жодного відгуку"
            emptyTitleDesktopText="У цього користувача немає жодного відгуку"
          />
        )}
      </div>
    </section>
  );
}
