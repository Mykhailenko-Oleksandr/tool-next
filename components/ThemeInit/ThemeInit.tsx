"use client";

import { useEffect } from "react";

export default function ThemeInit() {
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }
  }, []);

  return null;
}
