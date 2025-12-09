"use client";

import type { ChangeEvent } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (searchWord: string) => void;
}

export default function SearchBox({ onChange }: SearchBoxProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <input
      onChange={handleChange}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}
