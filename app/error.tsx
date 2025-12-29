"use client";
import css from "./error.module.css";

type Props = {
  reset: () => void;
};

export default function Error({ reset }: Props) {
  return (
    <section className={css.errorPage}>
      <div className="container">
        <div className={css.row}>
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className={css.errorBg}>
                <h1 className="text-center ">Oops</h1>
              </div>

              <div className={css.errorContentBox}>
                <h3 className={css.h2}>Помилка при завантаженні</h3>
                <p>При виконанні запита сталася помилка</p>
                <button onClick={reset} className={css.errorBtn}>
                  Спробувати знову
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
