"use client";

import Modal from "@/components/Modal/Modal";
import { useAuthStore } from "@/lib/store/authStore";
import { useCreatingDraftStore } from "@/lib/store/createToolStore";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { logout } from "@/lib/api/clientApi";

// v2807 [REMOVABLE BLOCK] Сигнал «открыть форму создания пустой»
// v2807 Что: одноразовый ключ, который говорит странице `/tools/new` принудительно открыть пустую форму.
// v2807 Зачем: Next может держать страницу/компонент `/tools/new` «живым» (без remount), а Zustand persist может догидратировать позже.
// v2807       Без явного сигнала форма создания может на долю секунды показать сохранённый черновик.
// v2807 Как используется:
// v2807 - источники навигации ставят этот флаг в sessionStorage
// v2807 - форма читает его в `useLayoutEffect` и дополнительно реагирует на window-event.
const OPEN_CREATE_TOOL_EMPTY_KEY = "creating-draft:open-empty";
// v2807 [/REMOVABLE BLOCK]

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  // ⛔️ НЕ ДЕСТРУКТУРУЄМО ЦІЛИЙ STORE
  const user = useAuthStore((state) => state.user);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const clearCreateToolDraft = useCreatingDraftStore((state) => state.clearDraft);

  const firstLetter = user?.name?.[0]?.toUpperCase() ?? "";
  const userAvatar = user?.avatarUrl;

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", isMenuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [isMenuOpen]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    if (isMenuOpen) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isMenuOpen]);

  const confirmLogout = async () => {
    await logout();
    clearIsAuthenticated();
    setIsLogoutOpen(false);
    closeMenu();
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.fullWidth}`}>
          <div className={styles.headerInner}>
            <Link
              href="/"
              className={styles.logo}
              aria-label="На головну">
              <svg
                className={styles.logoIcon}
                aria-hidden>
                <use href="/icons.svg#icon-logo" />
              </svg>
            </Link>

            <div className={styles.rightSection}>
              {user && (
                <button
                  className={clsx(
                    styles.createPost,
                    styles.tabletOnly,
                    styles.purpleButton
                  )}
                  onClick={() => {
                    // v2807 [REMOVABLE BLOCK] Принудительно открыть форму создания пустой (перед навигацией)
                    // v2807 Что: чистим черновик и в store, и в persisted storage + подаём сигнал форме, чтобы она сбросила себя.
                    // v2807 Зачем: чистить только store недостаточно (persist может догидратировать обратно); чистить только storage недостаточно
                    // v2807       (Formik может держать старые значения, если компонент не remount-ится).
                    // v2807 Как:
                    // v2807 - sessionStorage-флаг = сработает при обычном переходе на `/tools/new`
                    // v2807 - window-event = сработает даже если мы уже на `/tools/new` (роута не меняется)
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
                    router.push("/tools/new");
                    // v2807 [/REMOVABLE BLOCK]
                  }}>
                  Опублікувати оголошення
                </button>
              )}

              <button
                type="button"
                className={clsx(styles.burger, {
                  [styles.burgerActive]: isMenuOpen,
                })}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Меню"
                onClick={() => setIsMenuOpen((prev) => !prev)}>
                <svg
                  width="24"
                  height="24"
                  aria-hidden>
                  <use
                    href={
                      isMenuOpen
                        ? "/icons.svg#icon-close"
                        : "/icons.svg#icon-menu"
                    }
                  />
                </svg>
              </button>
            </div>

            <nav
              id="mobile-menu"
              className={clsx(styles.nav, { [styles.navOpen]: isMenuOpen })}>
              <Link
                href="/"
                onClick={closeMenu}
                className={clsx(styles.navLink, {
                  [styles.activeLink]: isActive("/"),
                })}>
                Головна
              </Link>

              <Link
                href="/tools"
                onClick={closeMenu}
                className={clsx(styles.navLink, {
                  [styles.activeLink]: isActive("/tools"),
                })}>
                Інструменти
              </Link>

              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className={clsx(styles.navLink, {
                      [styles.activeLink]: isActive("/profile"),
                    })}>
                    Мій профіль
                  </Link>

                  <button
                    className={clsx(
                      styles.createPost,
                      styles.desktopOnly,
                      styles.purpleButton
                    )}
                    onClick={() => {
                    // v2807 [REMOVABLE BLOCK] Та же логика «открыть пустой» для десктопной кнопки
                    // v2807 См. комментарий выше (Next cache + Zustand persist + внутреннее состояние Formik).
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
                      router.push("/tools/new");
                      // v2807 [/REMOVABLE BLOCK]
                    }}>
                    Опублікувати оголошення
                  </button>

                  <div className={styles.user}>
                    <div className={styles.userWrapper}>
                      <div className={styles.avatarContainer}>
                        {userAvatar ? (
                          <Image
                            src={userAvatar}
                            alt="User avatar"
                            className={styles.avatar}
                            priority
                            width={40}
                            height={40}
                          />
                        ) : (
                          <span
                            className={clsx(
                              styles.avatar,
                              styles.avatarFallback
                            )}>
                            {firstLetter}
                          </span>
                        )}
                      </div>
                      <span className={styles.username}>{user.name}</span>
                    </div>

                    <span className={styles.divider}></span>

                    <button
                      className={styles.logoutButton}
                      onClick={() => setIsLogoutOpen(true)}
                      aria-label="Вийти">
                      <svg
                        width="18"
                        height="18">
                        <use href="/icons.svg#icon-logout" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className={clsx(styles.navLink, {
                      [styles.activeLink]: isActive("/auth/login"),
                    })}>
                    Увійти
                  </Link>

                  <button
                    className={clsx(styles.register, styles.purpleButton)}
                    onClick={() => router.push("/auth/register")}>
                    Зареєструватися
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {isLogoutOpen && (
        <Modal
          title="Вихід з системи"
          confirmButtonText="Вийти"
          cancelButtonText="Залишитись"
          confirmButtonColor="purple"
          onConfirm={confirmLogout}
          onCancel={() => setIsLogoutOpen(false)}
          onClose={() => setIsLogoutOpen(false)}>
          Ви впевнені, що хочете вийти?
        </Modal>
      )}
    </>
  );
}
