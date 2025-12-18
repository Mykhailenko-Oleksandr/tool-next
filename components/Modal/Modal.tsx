'use client';

import { createPortal } from "react-dom";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import css from "./Modal.module.css";

interface ModalProps {
  title: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  confirmButtonColor?: "purple" | "red";
  children?: ReactNode;
}

export default function Modal({
  title,
  confirmButtonText = "Підтвердити",
  cancelButtonText = "Скасувати",
  onConfirm,
  onCancel,
  confirmButtonColor = "purple",
  children,
}: ModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onCancel();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onCancel]);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      setIsLoading(false);
      onCancel();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("Сталася помилка. Спробуйте ще раз.");
    }
  };

return createPortal(
  <div
    className={css.backdrop}
    role="dialog"
    aria-modal="true"
    onClick={handleBackdropClick}
  >
 <div className={css.modalContent}>
  <button className={css.closeBtn} onClick={onCancel} aria-label="Закрити модалку">
    <svg width="32" height="32" viewBox="0 0 32 32">
      <use href="/icons.svg#icon-close" />
    </svg>
  </button>

  <div className={css.content}>
    <h2 className={css.title}>{title}</h2>
    {children && <div className={css.text}>{children}</div>}
  </div>

  <div className={css.buttons}>
    <button className={`${css.modalButton} ${css.cancelBtn}`} onClick={onCancel} disabled={isLoading}>
      {cancelButtonText}
    </button>
    <button
      className={`${css.modalButton} ${confirmButtonColor === "red" ? css["confirmBtn-red"] : css["confirmBtn-purple"]}`}
      onClick={handleConfirm}
      disabled={isLoading}
    >
      {isLoading ? "Завантаження..." : confirmButtonText}
    </button>
  </div>
</div>


  </div>,
  document.body
);
}
