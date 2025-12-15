"use client";

import { useState } from "react";
import Modal from "@/components/Modal/Modal";

export default function TestModalWrapper() {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    console.log("confirm");
    setIsOpen(false);
  };

  const handleCancel = () => {
    console.log("cancel");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Спочатку авторизуйтесь"
      confirmButtonText="Підтвердити"
      cancelButtonText="Відмінити"
      confirmButtonColor="purple"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <p>Щоб забрронювати інструмент, треба спочатку зареєструватись, або авторизуватись на платформі</p>
    </Modal>
  );
}
