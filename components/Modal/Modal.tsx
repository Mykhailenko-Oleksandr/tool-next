"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import css from "./Modal.module.css";
import toast from "react-hot-toast";

interface ModalProps {
  title: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void; /// onCancel не обов'язковий
  onClose: () => void; /// додав onClose чисто для закриття модалки
  confirmButtonColor?: "purple" | "red";
  children?: ReactNode;
}

export default function Modal({
  title,
  confirmButtonText = "Підтвердити",
  cancelButtonText = "Скасувати",
  onConfirm,
  onCancel,
  onClose, /// додав onClose чисто для закриття модалки
  confirmButtonColor = "purple",
  children,
}: ModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]); /// oncCancel замінив на  onClose

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      setIsLoading(false); /// Тут ще було Onclose() я його прибрав
    } catch (error) {
      setIsLoading(false);
      toast.error("Сталася помилка. Спробуйте ще раз.");
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}>
      <div className={css.modalContent}>
        <button
          className={css.closeBtn}
          onClick={onClose}
          aria-label="Закрити модалку">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32">
            <use href="/icons.svg#icon-close" />
          </svg>
        </button>

        <div className={css.content}>
          <h2 className={css.title}>{title}</h2>
          {children && <div className={css.text}>{children}</div>}
        </div>

        <div className={css.buttons}>
          <button
            className={`${css.modalButton} ${css.cancelBtn}`}
            onClick={onCancel || onClose} /// якщо onCancel не передано, викликаємо onClose
            disabled={isLoading}>
            {cancelButtonText}
          </button>
          <button
            className={`${css.modalButton} ${confirmButtonColor === "red" ? css["confirmBtn-red"] : css["confirmBtn-purple"]}`}
            onClick={handleConfirm}
            disabled={isLoading}>
            {isLoading ? "Завантаження..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
