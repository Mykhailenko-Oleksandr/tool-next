"use client";

import Modal from "@/components/Modal/Modal";
import { useAuthStore } from "@/lib/store/authStore";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearIsAuthenticated } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

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
    await clearIsAuthenticated();
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
            <Link href="/" className={styles.logo} aria-label="На головну">
              <svg className={styles.logoIcon} aria-hidden>
                <use href="/icons.svg#icon-logo" />
              </svg>
            </Link>
            <div className={styles.rightSection}>
              {user && (
                <button
                  className={clsx(styles.createPost, styles.tabletOnly, styles.purpleButton)}
                  onClick={() => router.push("/posts/create")}
                >
                  Опублікувати оголошення
                </button>
              )}

              <button
                type="button"
                className={clsx(styles.burger, { [styles.burgerActive]: isMenuOpen })}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <svg width="24" height="24" aria-hidden>
                  <use href={isMenuOpen ? "/icons.svg#icon-close" : "/icons.svg#icon-menu"} />
                </svg>
              </button>
            </div>

            <nav id="mobile-menu" className={clsx(styles.nav, { [styles.navOpen]: isMenuOpen })}>
              <Link
                href="/"
                onClick={closeMenu}
                className={clsx(styles.navLink, { [styles.activeLink]: isActive("/") })}
              >
                Головна
              </Link>
              <Link
                href="/tools"
                onClick={closeMenu}
                className={clsx(styles.navLink, { [styles.activeLink]: isActive("/tools") })}
              >
                Інструменти
              </Link>

              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className={clsx(styles.navLink, { [styles.activeLink]: isActive("/profile") })}
                  >
                    Мій профіль
                  </Link>

                  <button
                    className={clsx(styles.createPost, styles.desktopOnly, styles.purpleButton)}
                    onClick={() => router.push("/posts/create")}
                  >
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
                          />
                        ) : (
                          <span className={clsx(styles.avatar, styles.avatarFallback)}>
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
                      aria-label="Вийти"
                    >
                      <svg width="18" height="18">
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
                    })}
                  >
                    Увійти
                  </Link>
                  <button
                    className={clsx(styles.register, styles.purpleButton)}
                    onClick={() => router.push("/auth/register")}
                  >
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
          onClose={() => setIsLogoutOpen(false)}
        >
          Ви впевнені, що хочете вийти?
        </Modal>
      )}
    </>
  );
}
