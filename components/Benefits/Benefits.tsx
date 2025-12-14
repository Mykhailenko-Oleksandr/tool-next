import clsx from "clsx";
import css from "./Benefits.module.css";

export default function Benefits() {
  return (
    <section className={css.benefits}>
      <div className={css.container}>
        <h2 className={clsx(css.benefitsTitle, css.visuallyHidden)}>Benefits</h2>
        <div className={css.benefitsContainer}>
          <h3 className={css.benefitsContainerTitle}>
            ToolNext — платформа для швидкої та зручної оренди інструментів
          </h3>
          <p className={css.benefitsContainerText}>
            ToolNext допомагає знайти потрібний інструмент у декілька кліків.
            <br />
            Користувачі можуть легко орендувати обладнання для ремонту чи хобі, а власники — зручно
            керувати своїми оголошеннями.
            <br />
            Ми створили сервіс, щоб зробити процес оренди простим, доступним і вигідним для всіх.
          </p>
        </div>
        <ul className={css.benefitsList}>
          <li className={css.benefitsListItem}>
            <svg className={css.benefitsListIcon} width="48" height="48">
              <use href="/icons.svg#icon-service-toolbox" />
            </svg>
            <h3 className={css.benefitsListItemTitle}>Легкий доступ до інструментів</h3>
            <p className={css.benefitsListItemText}>
              Знаходьте потрібний інструмент у своєму районі без зайвих дзвінків і пошуків. Просто
              введіть назву — і отримайте варіанти поруч із вами.
            </p>
          </li>
          <li className={css.benefitsListItem}>
            <svg className={css.benefitsListIcon} width="48" height="48">
              <use href="/icons.svg#icon-checkbook" />
            </svg>
            <h3 className={css.benefitsListItemTitle}>Швидке бронювання</h3>
            <p className={css.benefitsListItemText}>
              Бронюйте інструменти в кілька кліків. Жодних складних форм чи довгих очікувань —
              тільки простий та зручний процес.
            </p>
          </li>
          <li className={css.benefitsListItem}>
            <svg className={css.benefitsListIcon} width="48" height="48">
              <use href="/icons.svg#icon-manage-accounts" />
            </svg>
            <h3 className={css.benefitsListItemTitle}>Зручне управління</h3>
            <p className={css.benefitsListItemText}>
              Додавайте свої інструменти в каталог, редагуйте оголошення та контролюйте оренду.
              ToolNext допомагає перетворити зайві інструменти на додатковий дохід.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
