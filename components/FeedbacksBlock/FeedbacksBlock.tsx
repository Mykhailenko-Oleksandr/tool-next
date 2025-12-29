"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import styles from "./FeedbacksBlock.module.css";
import FeedbacksSwiper from "./FeedbacksSwiper";
import { fetchFeedbacks, fetchUserFeedbacks } from "@/lib/api/clientApi";

interface FeedbacksBlockProps {
  userId?: string;
  title?: string;
}

export default function FeedbacksBlock({ userId, title }: FeedbacksBlockProps) {
  const {
    data: feedbacks,
    isLoading,
    error,
  } = useQuery({
    queryKey: userId ? ["feedbacks", "user", userId] : ["feedbacks"],
    queryFn: () => (userId ? fetchUserFeedbacks(userId) : fetchFeedbacks()),
    staleTime: 5 * 60 * 1000,
  });

  const visibleFeedbacks = useMemo(() => feedbacks ?? [], [feedbacks]);

  return (
    <section
      className={styles.sectionWrapper}
      aria-labelledby="feedbacks-title">
      <div className={styles.container}>
        <h2
          id="feedbacks-title"
          className={styles.title}>
          {title || "Останні відгуки"}
        </h2>

        {isLoading && (
          <p
            className={styles.statusText}
            aria-live="polite">
            Завантаження відгуків...
          </p>
        )}

        {error && (
          <p
            className={styles.statusText}
            role="status"
            aria-live="polite">
            Помилка завантаження відгуків
          </p>
        )}

        {!isLoading && !error && visibleFeedbacks.length === 0 && (
          <p className={styles.statusText}>Поки немає відгуків</p>
        )}

        {!isLoading && !error && visibleFeedbacks.length > 0 && (
          <FeedbacksSwiper feedbacks={visibleFeedbacks} />
        )}
      </div>
    </section>
  );
}
