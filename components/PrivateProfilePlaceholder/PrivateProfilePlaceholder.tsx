import Link from "next/link";
import css from "./PrivateProfilePlaceholder.module.css";

export default function PrivateProfilePlaceholder() {
  return (
    <div className={css.profilePlaceholderContainer}>
      <h4 className={css.profilePlaceholderTitle}>
        У вас ще не опубліковано жодного інструменту
      </h4>
      <p className={css.profilePlaceholderText}>
        Мершій обулікуйте своє перше оголошення, щоб почати отримувати пасивний
        дохід
      </p>
      <Link className={css.profilePlaceholderLink} href="/tools/new">
        Опублікувати інструмент
      </Link>
    </div>
  );
}
