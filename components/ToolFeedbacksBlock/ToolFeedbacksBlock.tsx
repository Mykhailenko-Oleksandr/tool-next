"use client";

import { useState } from "react";
import FeedbackFormModal from "../FeedbackFormModal/FeedbackFormModal";
import css from "./ToolFeedbacksBlock.module.css";

interface Props {
  toolId: string;
}

const ToolFeedbacksBlock = ({ toolId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Типізуємо хук: feedbacks завжди масив Feedback

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className={css.feedbacksSection} aria-labelledby="feedbacks-title">
      <h2 className={css.title}>Відгуки</h2>
      <button className={css.feedbacksBtn} onClick={() => setIsModalOpen(true)}>
        Додати відгук
      </button>

      {isModalOpen && <FeedbackFormModal toolId={toolId} onClose={handleCloseModal} />}
    </section>
  );
};

export default ToolFeedbacksBlock;
