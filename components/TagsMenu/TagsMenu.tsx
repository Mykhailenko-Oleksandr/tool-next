"use client";

import { useState } from "react";
import css from "./TagsMenu.module.css";
import Link from "next/link";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggle}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          <li className={css.menuItem}>
            <Link
              href={`/notes/filter/All`}
              className={css.menuLink}
              onClick={toggle}
            >
              All notes
            </Link>
          </li>
          {tags.map((tag) => {
            return (
              <li className={css.menuItem} key={tag}>
                <Link
                  href={`/notes/filter/${tag}`}
                  className={css.menuLink}
                  onClick={toggle}
                >
                  {tag}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
