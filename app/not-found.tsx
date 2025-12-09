import { Metadata } from "next";
import css from "./Home.module.css";

export const metadata: Metadata = {
  title: "Not Found",
  description: "No such page exists",
  openGraph: {
    title: "Not Found",
    description: "No such page exists",
    url: "https://08-zustand-blush-beta.vercel.app",
    images: [
      { url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg" },
    ],
  },
};

export default function NotFound() {
  return (
    <div className={`${css.container} ${css.main}`}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
