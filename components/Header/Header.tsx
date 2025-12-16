'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/lib/store/authStore';
// import { ConfirmationModal } from '../Modal/Modal';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const { user, clearIsAuthenticated } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const firstLetter = user?.username?.[0]?.toUpperCase() ?? '';
  const userAvatar = user?.avatar;

  const closeMenu = () => setIsMenuOpen(false);

  /* ===== BODY SCROLL LOCK ===== */
  useEffect(() => {
    document.body.classList.toggle('no-scroll', isMenuOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [isMenuOpen]);

  /* ===== ESC CLOSE ===== */
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && closeMenu();
    if (isMenuOpen) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isMenuOpen]);

  // const confirmLogout = async () => {
  //   await clearIsAuthenticated();
  //   setIsLogoutOpen(false);
  //   closeMenu();
  //   router.push('/');
  // };

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.full_width}`}>
          <div className={styles.header__inner}>
            {/* LOGO */}
            <Link href="/" className={styles.header__logo} aria-label="На головну">
              <svg className={styles.header__logoIcon} aria-hidden>
                <use href="/icons.svg#icon-logo" />
              </svg>
            </Link>

            {/* DESKTOP NAV */}
            <nav className={styles.header__nav} aria-label="Головна навігація">
              <Link href="/">Головна</Link>
              <Link href="/tools">Інструменти</Link>
              <div className={styles.header__auth}>
                {user ? (
                  <>
                    <Link href="/profile">Мій профіль</Link>
                    <button type="button" className={styles.create_post_header}>
                      <span className={styles.create_post_text}>Опублікувати оголошення</span>
                    </button>
                    <div className={styles.header__user}>
                      <div className={styles.user_wrapper}>
                        <div className={styles.avatar_container}>
                          {userAvatar ? (
                            <Image
                              src={userAvatar}
                              alt="User avatar"
                              className={styles.headers_avatar}
                              priority
                            />
                          ) : (
                            <span className={styles.header__avatar}>{firstLetter}</span>
                          )}
                        </div>
                        <span className={styles.header__authButtons}>{user.username}</span>
                      </div>
                      <span className={styles.divider}></span>
                      <button
                        type="button"
                        onClick={() => setIsLogoutOpen(true)}
                        className={styles.header__logoutButtons}
                        aria-label="Вийти"
                      >
                        <svg width="18" height="18" aria-hidden="true">
                          <use href="/icons.svg#icon-logout" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={styles.header__authButtons}>
                    <Link href="/auth/login">Увійти</Link>
                    <Link href="/auth/register">Реєстрація</Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Make an announcement */}
            <div className={styles.create_post_container}>
              <button type="button" className={styles.create_post}>
                <span className={styles.create_post_text}>Опублікувати оголошення</span>
              </button>

              {/* BURGER */}
              <button
                type="button"
                className={styles.header__burger}
                aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <svg className={styles.header__burgerIcon} width="40" height="40" aria-hidden>
                  <use href={isMenuOpen ? '/icons.svg#icon-close' : '/icons.svg#icon-menu'} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          id="mobile-menu"
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}
          role="dialog"
          aria-modal="true"
        >
          <nav>
            <Link href="/" onClick={closeMenu}>
              Головна
            </Link>
            <Link href="/tools" onClick={closeMenu}>
              Інструменти
            </Link>
            {user ? (
              <>
                <Link href="/profile" onClick={closeMenu}>
                  Мій Профіль
                </Link>
                <div className={styles.user_container}>
                  <div className={styles.header__user}>
                    <div className={styles.user_wrapper}>
                      <div className={styles.avatar_container}>
                        {userAvatar ? (
                          <Image
                            src={userAvatar}
                            alt="User avatar"
                            className={styles.headers_avatar}
                            priority
                          />
                        ) : (
                          <span className={styles.header__avatar}>{firstLetter}</span>
                        )}
                      </div>
                      <span className={styles.header__authButtons}>{user.username}</span>
                    </div>
                    <span className={styles.divider}></span>
                    <button
                      type="button"
                      onClick={() => setIsLogoutOpen(true)}
                      className={styles.header__logoutButtons}
                      aria-label="Вийти"
                    >
                      <svg width="18" height="18" aria-hidden="true">
                        <use href="/icons.svg#icon-logout" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">Увійти</Link>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/auth/register';
                  }}
                  className={styles.register_button}
                >
                  Зареєструватися
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* <ConfirmationModal
        isOpen={isLogoutOpen}
        title="Вихід з системи"
        message="Ви впевнені, що хочете вийти?"
        confirmText="Вийти"
        cancelText="Скасувати"
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutOpen(false)}
      /> */}
    </>
  );
}
