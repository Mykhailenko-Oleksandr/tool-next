"use client";

import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const { isAuthenticated, user } = useAuthStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.topSection}>
          <Link href={"/"} className={styles.logo} aria-label="Logotype">
            <svg className={styles.logoIcon} width={159} height={29}>
              <use href="/icons.svg#icon-logo" />
            </svg>
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              Головна
            </Link>
            <Link href="/tools" className={styles.navLink}>
              Інструменти
            </Link>
            {isAuthenticated && user ? (
              <>
                <Link href="/profile" className={styles.navLink}>
                  Мій профіль
                </Link>
                <Link href="/tools/new" className={styles.navLink}>
                  Опублікувати
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className={styles.navLink}>
                  Увійти
                </Link>
                <Link href="/auth/register" className={styles.navLink}>
                  Зареєструватися
                </Link>
              </>
            )}
          </nav>

          <div className={styles.social}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Facebook"
            >
              <svg className={styles.socialIcon}>
                <use href="/icons.svg#icon-facebook" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <svg className={styles.socialIcon}>
                <use href="/icons.svg#icon-instagram" />
              </svg>
            </a>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &#169; {currentYear} ToolNext. Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
}
