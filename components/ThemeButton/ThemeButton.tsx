"use client";

import { useState, useEffect } from "react";
import css from "./ThemeButton.module.css";

export default function ThemeButton() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.body.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
      localStorage.removeItem("theme");
      setIsDark(false);
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={css.buttonTheme}>
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
