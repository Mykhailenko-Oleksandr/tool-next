"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import css from "./NotFound.module.css";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={css["not-found-section"]}>
      <div className="container">
        <div className={css.content}>
          <div className={`${css["number-wrapper"]} ${mounted ? css["animate"] : ""}`}>
            <span className={css.number}>4</span>
            <div className={css["zero-wrapper"]}>
            <div className={css.zero}>0</div>
            <div className={css["zero-shadow"]}>0</div>
            <div className={`${css["zero-eyes"]} ${mounted ? css["eyes-open"] : ""}`}>
              <div className={css["eye-wrapper"]}>
                <div className={css["eye"]}>
                  <div className={css["pupil"]}></div>
                </div>
                <div className={css["lashes-radial"]}>
                  {[...Array(20)].map((_, i) => (
                    <span key={i} className={css["radial-lash"]}></span>
                  ))}
                </div>
              </div>
              <div className={css["eye-wrapper"]}>
                <div className={css["eye"]}>
                  <div className={css["pupil"]}></div>
                </div>
                <div className={css["lashes-radial"]}>
                  {[...Array(20)].map((_, i) => (
                    <span key={i} className={css["radial-lash"]}></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
            <span className={css.number}>4</span>
          </div>
          
          <h1 className={`${css.title} ${mounted ? css["fade-in"] : ""}`}>
            Сторінку не знайдено
          </h1>
          
          <p className={`${css.description} ${mounted ? css["fade-in-delay"] : ""}`}>
            Схоже, що сторінка, яку ви шукаєте, не існує або була переміщена.
          </p>
          
          <Link 
            href="/" 
            className={`${css["home-button"]} ${mounted ? css["slide-up"] : ""}`}
          >
            Повернутися на головну
          </Link>
        </div>
        
        <div className={css.background}>
          <div className={css["floating-shape"]}></div>
          <div className={css["floating-shape"]}></div>
          <div className={css["floating-shape"]}></div>
        </div>
      </div>
    </section>
  );
}
