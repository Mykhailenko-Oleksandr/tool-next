"use client";

import Link from "next/link";
import css from "./ProfilePlaceholder.module.css";
import { useAuthStore } from "@/lib/store/authStore";

export default function ProfilePlaceholder() {
  const { isAuthenticated } = useAuthStore();
  //   const isAuthenticated = true;
  return (
    <div className="container">
      {isAuthenticated ? (
        <div className={css.profilePlaceholderContainer}>
          <h4 className={css.profilePlaceholderTitle}>
            У вас ще не опубліковано жодного інструменту
          </h4>
          <p className={css.profilePlaceholderText}>
            Мершій обулікуйте своє перше оголошення, щоб почати отримувати пасивний дохід
          </p>
          <Link className={css.profilePlaceholderLink} href="/tools/new">
            Опублікувати інструмент
          </Link>
        </div>
      ) : (
        <div className={css.profilePlaceholderContainer}>
          <h4 className={css.profilePlaceholderTitle}>
            У цього користувача ще не опубліковано жодного інструменту
          </h4>
          <p className={css.profilePlaceholderText}>
            У нас є великий вибір інструментів від інших користувачів
          </p>
          <Link className={css.profilePlaceholderLink} href="/">
            Всі інструменти
          </Link>
        </div>
      )}
    </div>
  );
}
