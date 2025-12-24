"use client";

import { useState } from "react";
import { createFeedback } from "@/lib/api/clientApi";
import { CreateFeedbackDto } from "@/types/feedback";
import css from "./FeedbackFormModal.module.css";

interface Props {
  toolId: string;
  onClose: () => void;
  onSuccess: () => void; // викликається після успішного сабміту
}

export default function FeedbackFormModal({ toolId, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dto: CreateFeedbackDto = { toolId, name, description, rate };
      await createFeedback(dto);
      onSuccess(); // оновлюємо список
      onClose(); // закриваємо модалку
    } catch (err) {
      console.error(err);
      alert("Помилка при створенні фідбеку");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.modalBackdrop}>
      <div className={css.modalContent}>
        <button onClick={onClose} className={css.closeBtn}>
          ✖
        </button>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Ваше ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Відгук"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            min={1}
            max={5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Завантаження..." : "Відправити"}
          </button>
        </form>
      </div>
    </div>
  );
}
