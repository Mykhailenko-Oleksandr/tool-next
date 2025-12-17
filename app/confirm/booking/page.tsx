import Link from 'next/link';
import styles from './BookingConfirmation.module.css';
import '@/app/globals.css';

export const metadata = {
  title: 'Інструмент успішно заброньовано',
  description: 'Підтвердження бронювання інструменту. Дякуємо за бронювання!',
  openGraph: {
    title: 'Інструмент успішно заброньовано',
    description: 'Власник інструменту скоро з вами звʼяжеться стосовно деталей та оплати вашої броні.',
    url: '/confirm/booking',
  },
};

export default function BookingConfirmationPage() {
  return (
    <div className="container">
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h1 className={styles.title}>Інструмент успішно заброньовано</h1>
          <p className={styles.text}>
            Власник інструменту скоро з вами звʼяжеться стосовно деталей та оплати вашої броні
          </p>
          <Link href="/" className={styles.button}>
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}
