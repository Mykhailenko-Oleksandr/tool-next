'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './Footer.module.css';

export default function Footer() {
  const { user } = useAuthStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top section with logo, nav, and social */}
        <div className={styles.topSection}>
          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoInner}>
              <svg className={styles.logoIcon}>
                <use href="/icons.svg#icon-logo" />
              </svg>
            </div>
          </div>

          {/* Navigation */}
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              Головна
            </Link>
            <Link href="/tools" className={styles.navLink}>
              Інструменти
            </Link>
            {user ? (
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
                  Уйти
                </Link>
                <Link href="/auth/register" className={styles.navLink}>
                  Зареєструватися
                </Link>
              </>
            )}
          </nav>

          {/* Social icons */}
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

        {/* Bottom section with copyright */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>© {currentYear} ToolNext. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  );
}
