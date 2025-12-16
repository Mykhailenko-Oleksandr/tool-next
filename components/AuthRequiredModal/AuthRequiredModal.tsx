"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import css from "./AuthRequiredModal.module.css";

interface AuthRequiredModalProps {
    onClose: () => void;
}

export default function AuthRequiredModal({ onClose }: AuthRequiredModalProps) {
    const router = useRouter();

    const handleLogin = () => {
        onClose();
        router.push("/auth/login");
    };

    const handleRegister = () => {
        onClose();
        router.push("/auth/register");
    };

    return (
        <Modal onClose={onClose}>
            <div className={css.modal}>
                <button
                    type="button"
                    className={css.closeButton}
                    onClick={onClose}
                    aria-label="Закрити"
                >
                    ×
                </button>
                <h2 className={css.title}>Спочатку авторизуйтесь</h2>
                <p className={css.text}>
                    Щоб забронювати інструмент, треба спочатку зареєструватись, або
                    авторизуватись на платформі
                </p>
                <div className={css.buttons}>
                    <button
                        type="button"
                        className={css.loginButton}
                        onClick={handleLogin}
                    >
                        Вхід
                    </button>
                    <button
                        type="button"
                        className={css.registerButton}
                        onClick={handleRegister}
                    >
                        Реєстрація
                    </button>
                </div>
            </div>
        </Modal>
    );
}

