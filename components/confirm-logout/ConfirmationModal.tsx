// 'use client'
import { Modal } from '@/components/Modal/Modal';
import css from '@/components/confirm-logout/ConfirmationModal.module.css';

interface ConfirmLogoutProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({
  onConfirm,
  onCancel,

  message = 'Ви впевнені, що хочете вийти?',
  confirmText = 'Вийти',
  cancelText = 'Скасувати',
}: ConfirmLogoutProps) {
  return (
    <Modal onClose={onCancel}>
      <div className={css.backdrop}>
        <div className={css.modal}>
          <div className="container, ${css.wrapper}">
            <button type="button" className={css.closeButton} onClick={onCancel} aria-label="Close">
              <svg width="24" height="24">
                <use href="/icons.svg#icon-close" />
              </svg>
            </button>
            <p className={css.text}>{message}</p>
            <div className={css.actions}>
              <button type="button" className={css.cancel} onClick={onCancel}>
                {cancelText}
              </button>
              <button type="button" className={css.confirm} onClick={onConfirm}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
