"use client";

import StarsRating from "@/components/StarsRating/StarsRating";
import styles from "./ToolInfoBlock.module.css";

// V2807: Показывает рейтинг инструмента (звёзды + число) и количество отзывов.
interface ToolInfoBlockProps {
  rating: number;
  feedbacksCount: number;
}

export default function ToolInfoBlock({
  rating,
  feedbacksCount,
}: ToolInfoBlockProps) {
  const safeRating = Number.isFinite(rating) ? rating : 0;
  const normalizedRating = Math.max(0, Math.min(5, safeRating));

  return (
    <div className={styles.wrapper}>
      <div className={styles.ratingBlock}>
        <StarsRating rating={normalizedRating} />
        <span className={styles.ratingValue}>{normalizedRating.toFixed(1)}</span>
      </div>
      <span className={styles.feedbacksCount}>
        {feedbacksCount} {feedbacksCount === 1 ? "відгук" : feedbacksCount < 5 ? "відгуки" : "відгуків"}
      </span>
    </div>
  );
}



