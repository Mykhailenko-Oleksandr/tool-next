import SearchBar from "@/components/SearchBar/SearchBar";
import css from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={css.hero} id="hero">
      <div className={`container ${css["hero-container"]}`}>
        <h1 className={css["hero-title"]}>ToolNext — ваш надійний сусід</h1>
        <div className={css["hero-in-wrap"]}>
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
