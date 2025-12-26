"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useCreatingDraftStore } from "@/lib/store/createToolStore";
import Link from "next/link";
import styles from "./Footer.module.css";

// v2807 [REMOVABLE BLOCK] Сигнал «открыть форму создания пустой»
// v2807 Что/Зачем: то же, что и в Header — заставляет `/tools/new` открываться пустой несмотря на кеш Next и гидрацию Zustand persist.
const OPEN_CREATE_TOOL_EMPTY_KEY = "creating-draft:open-empty";
// v2807 [/REMOVABLE BLOCK]

export default function Footer() {
  const { isAuthenticated, user } = useAuthStore();
  const clearCreateToolDraft = useCreatingDraftStore((state) => state.clearDraft);
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
                <Link
                  href="/tools/new"
                  className={styles.navLink}
                  onClick={() => {
                    // v2807 [REMOVABLE BLOCK] Принудительно открыть форму создания пустой (ссылка в Footer)
                    // v2807 Зачем: Footer использует <Link>, remount не гарантирован; Formik/Zustand могут удерживать старый черновик.
                    // v2807 Как: одноразовый флаг + очистка store/storage + событие (покрывает кейс «уже на /tools/new»).
                    try {
                      sessionStorage.setItem(OPEN_CREATE_TOOL_EMPTY_KEY, "1");
                    } catch {
                      // ignore
                    }
                    clearCreateToolDraft();
                    try {
                      useCreatingDraftStore.persist.clearStorage();
                    } catch {
                      // ignore
                    }
                    try {
                      window.dispatchEvent(new Event("creating-draft:open-empty"));
                    } catch {
                      // ignore
                    }
                    // v2807 [/REMOVABLE BLOCK]
                  }}
                >
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
