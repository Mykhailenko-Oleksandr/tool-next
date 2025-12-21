import Link from "next/link";
import css from "./PublicProfilePlaceholder.module.css";

export default function PublicProfilePlaceholder() {
  return (
    <div className="container">
      <div className={css.profilePlaceholderContainer}>
        <h4 className={css.profilePlaceholderTitle}>
          У цього користувача ще не опубліковано жодного інструменту
        </h4>
        <p className={css.profilePlaceholderText}>
          У нас є великий вибір інструментів від інших користувачів
        </p>
        <Link className={css.profilePlaceholderLink} href="/tools">
          Всі інструменти
        </Link>
      </div>
    </div>
  );
}
