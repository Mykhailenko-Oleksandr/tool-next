"use client";

import { Tool } from "@/types/tool";
import FeedbacksSwiper from "./ToolInfoBlockSwiper";
import { useToolFeedbacks } from "@/lib/hooks/useFeedbacks";
import css from "./ToolInfoBlock.module.css";

interface Props {
  tool: Tool & { averageRating: number; feedbackCount: number };
}

const ToolInfoBlock = ({ tool }: Props) => {
  const { data = [], isLoading, isError } = useToolFeedbacks(tool._id);

  if (isLoading) {
    return <p>Завантажуємо відгуки...</p>;
  }

  if (isError) {
    return <p>Не вдалося завантажити відгуки 😔</p>;
  }

  return (
    <div className={css.infoBlock}>
      {data.length > 0 ? (
        <FeedbacksSwiper feedbacks={data} />
      ) : (
        <div className={css.wrapper}>
          <h2 className={css.statusTitle}>У цього інструменту ще немає відгуків.</h2>
          <p className={css.statusText}>Ми впевнені, скоро їх буде більше!</p>
        </div>
      )}
    </div>
  );
};

export default ToolInfoBlock;
